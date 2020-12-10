/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {
  TapReporter,
  TestService,
  JUnitReporter,
  AsyncTestConfiguration,
  AsyncTestArrayConfiguration,
  SyncTestConfiguration,
  TestItem,
  TestResult
} from '@salesforce/apex-node';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, Org } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import {
  CliJsonFormat,
  JsonReporter,
  HumanReporter
} from '../../../../reporters';
import { buildDescription, logLevels, resultFormat } from '../../../../utils';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-apex', 'run');

export const TestLevel = [
  'RunLocalTests',
  'RunAllTestsInOrg',
  'RunSpecifiedTests'
];

const CLASS_ID_PREFIX = '01p';

export function buildTestItem(testNames: string): TestItem[] {
  const testNameArray = testNames.split(',');
  const tItems = testNameArray.map(item => {
    if (item.indexOf('.') > 0) {
      const splitItemData = item.split('.');
      return {
        className: splitItemData[0],
        testMethods: [splitItemData[1]]
      } as TestItem;
    }

    return { className: item } as TestItem;
  });
  return tItems;
}

export default class Run extends SfdxCommand {
  protected static requiresUsername = true;
  // Guaranteed by requires username
  protected org!: Org;

  public static description = buildDescription(
    messages.getMessage('commandDescription'),
    messages.getMessage('longDescription')
  );

  public static longDescription = messages.getMessage('longDescription');
  public static examples = [
    `$ sfdx force:apex:test:run`,
    `$ sfdx force:apex:test:run -n "MyClassTest,MyOtherClassTest" -r human`,
    `$ sfdx force:apex:test:run -s "MySuite,MyOtherSuite" -c -v --json`,
    `$ sfdx force:apex:test:run -t "MyClassTest.testCoolFeature,MyClassTest.testAwesomeFeature,AnotherClassTest,namespace.TheirClassTest.testThis" -r human`,
    `$ sfdx force:apex:test:run -l RunLocalTests -d <path to outputdir> -u me@my.org`
  ];

  protected static flagsConfig = {
    json: flags.boolean({
      description: messages.getMessage('jsonDescription')
    }),
    loglevel: flags.enum({
      description: messages.getMessage('logLevelDescription'),
      longDescription: messages.getMessage('logLevelLongDescription'),
      default: 'warn',
      options: logLevels
    }),
    apiversion: flags.builtin(),
    codecoverage: flags.boolean({
      char: 'c',
      description: messages.getMessage('codeCoverageDescription')
    }),
    outputdir: flags.string({
      char: 'd',
      description: messages.getMessage('outputDirectoryDescription')
    }),
    testlevel: flags.enum({
      char: 'l',
      description: messages.getMessage('testLevelDescription'),
      options: TestLevel
    }),
    classnames: flags.string({
      char: 'n',
      description: messages.getMessage('classNamesDescription')
    }),
    resultformat: flags.enum({
      char: 'r',
      description: messages.getMessage('resultFormatLongDescription'),
      options: resultFormat
    }),
    suitenames: flags.string({
      char: 's',
      description: messages.getMessage('suiteNamesDescription')
    }),
    tests: flags.string({
      char: 't',
      description: messages.getMessage('testsDescription')
    }),
    wait: flags.string({
      char: 'w',
      description: messages.getMessage('waitDescription')
    }),
    synchronous: flags.boolean({
      char: 'y',
      description: messages.getMessage('synchronousDescription')
    }),
    verbose: flags.builtin({
      description: messages.getMessage('verboseDescription')
    }),
    detailedcoverage: flags.boolean({
      char: 'v',
      description: messages.getMessage('detailedCoverageDescription'),
      dependsOn: ['codecoverage']
    })
  };

  public async run(): Promise<AnyJson> {
    try {
      await this.validateFlags();
      const testLevel = this.flags.testlevel
        ? this.flags.testlevel
        : 'RunSpecifiedTests';

      const conn = this.org.getConnection();
      const testService = new TestService(conn);
      let result: TestResult;

      if (this.flags.synchronous) {
        let testOptions: SyncTestConfiguration;
        if (this.flags.tests) {
          testOptions = {
            tests: buildTestItem(this.flags.tests),
            testLevel
          };

          const classes = testOptions.tests?.map(testItem => {
            if (testItem.className) {
              return testItem.className;
            }
          });
          if (new Set(classes).size !== 1) {
            return Promise.reject(
              new Error(messages.getMessage('syncClassErr'))
            );
          }
        } else {
          const prop = this.flags.classnames
            .toLowerCase()
            .startsWith(CLASS_ID_PREFIX)
            ? 'classId'
            : 'className';
          testOptions = {
            tests: [{ [prop]: this.flags.classnames }],
            testLevel
          };
        }

        result = await testService.runTestSynchronous(
          testOptions,
          this.flags.codecoverage
        );
      } else {
        let payload: AsyncTestConfiguration | AsyncTestArrayConfiguration;

        if (this.flags.tests) {
          payload = {
            tests: buildTestItem(this.flags.tests),
            testLevel
          };
        } else {
          payload = {
            classNames: this.flags.classnames,
            suiteNames: this.flags.suitenames,
            testLevel
          };
        }

        result = await testService.runTestAsynchronous(
          payload,
          this.flags.codecoverage
        );
      }

      if (this.flags.outputdir) {
        const jsonOutput = this.logJson(result) as CliJsonFormat;
        const outputDirConfig = {
          dirPath: this.flags.outputdir,
          fileInfos: [
            {
              filename: `test-result-${result.summary.testRunId}.json`,
              content: jsonOutput
            },
            ...(jsonOutput.coverage
              ? [
                  {
                    filename: `test-result-codecoverage.json`,
                    content: jsonOutput.coverage
                  }
                ]
              : [])
          ],
          ...(this.flags.resultformat === 'junit' ||
          this.flags.resultformat === 'tap'
            ? { resultFormat: this.flags.resultformat }
            : {})
        };

        await testService.writeResultFiles(
          result,
          outputDirConfig,
          this.flags.codecoverage
        );
      }

      switch (this.flags.resultformat) {
        case 'human':
          this.logHuman(
            result,
            this.flags.detailedcoverage,
            this.flags.outputdir
          );
          break;
        case 'tap':
          this.logTap(result);
          break;
        case 'junit':
          this.logJUnit(result);
          break;
        case 'json':
          this.ux.logJson(this.logJson(result));
          break;
        default:
          const id = result.summary.testRunId;
          const username = result.summary.username;
          this.ux.log(
            messages.getMessage('runTestReportCommand', [id, username])
          );
      }

      return this.logJson(result) as AnyJson;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async validateFlags(): Promise<void> {
    if (this.flags.codecoverage && !this.flags.resultformat) {
      return Promise.reject(
        new Error(messages.getMessage('missingReporterErr'))
      );
    }

    if (
      (this.flags.classnames && (this.flags.suitenames || this.flags.tests)) ||
      (this.flags.suitenames && this.flags.tests)
    ) {
      return Promise.reject(
        new Error(messages.getMessage('classSuiteTestErr'))
      );
    }

    if (
      this.flags.synchronous &&
      (this.flags.suitenames ||
        (this.flags.classnames && this.flags.classnames.split(',').length > 1))
    ) {
      return Promise.reject(new Error(messages.getMessage('syncClassErr')));
    }

    if (
      (this.flags.tests || this.flags.classnames || this.flags.suitenames) &&
      this.flags.testlevel &&
      this.flags.testlevel !== 'RunSpecifiedTests'
    ) {
      return Promise.reject(new Error(messages.getMessage('testLevelErr')));
    }
  }

  private logHuman(
    result: TestResult,
    detailedCoverage: boolean,
    outputDir: string
  ): void {
    try {
      if (outputDir) {
        this.ux.log(messages.getMessage('outputDirHint', [outputDir]));
      }
      const humanReporter = new HumanReporter();
      const output = humanReporter.format(result, detailedCoverage);
      this.ux.log(output);
    } catch (e) {
      this.ux.logJson(result);
      const msg = messages.getMessage('testResultProcessErr', [e]);
      this.ux.error(msg);
    }
  }

  private logTap(result: TestResult): void {
    try {
      const reporter = new TapReporter();
      const hint = this.formatReportHint(result);
      this.ux.log(reporter.format(result, [hint]));
    } catch (err) {
      this.ux.logJson(result);
      const msg = messages.getMessage('testResultProcessErr', [err]);
      this.ux.error(msg);
    }
  }

  private logJUnit(result: TestResult): void {
    try {
      const reporter = new JUnitReporter();
      this.ux.log(reporter.format(result));
    } catch (e) {
      this.ux.logJson(result);
      const msg = messages.getMessage('testResultProcessErr', [e]);
      this.ux.error(msg);
    }
  }

  private logJson(result: TestResult): CliJsonFormat | TestResult {
    try {
      const reporter = new JsonReporter();
      return reporter.format(result);
    } catch (e) {
      this.ux.logJson(result);
      const msg = messages.getMessage('testResultProcessErr', [e]);
      this.ux.error(msg);
    }
    return result;
  }

  private formatReportHint(result: TestResult): string {
    let reportArgs = `-i ${result.summary.testRunId}`;
    if (this.flags.targetusername) {
      reportArgs += ` -u ${this.flags.targetusername}`;
    }
    const hint = messages.getMessage('apexTestReportFormatHint', [reportArgs]);
    return hint;
  }
}
