/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  ApexCodeCoverageAggregateRecord,
  ApexTestResultOutcome,
  ApexTestResultRecord,
  AsyncTestResult
} from '../../src/tests/types';

export const testRunId = '707xx0000AGQ3jbQQD';
export const testResultData: AsyncTestResult = {
  // @ts-ignore
  summary: {
    failRate: '0%',
    numTestsRan: 1,
    outcome: 'Completed',
    passRate: '100%',
    skipRate: '0%',
    testStartTime: '2020-07-12T02:54:47.000+0000',
    testExecutionTime: 1765,
    testRunId,
    userId: '005xx000000abcDAAU'
  },
  tests: [
    {
      id: '07Mxx00000F2Xx6UAF',
      queueItemId: '7092M000000Vt94QAC',
      stackTrace: null,
      message: null,
      asyncApexJobId: testRunId,
      methodName: 'testLoggerLog',
      outcome: ApexTestResultOutcome.Pass,
      apexLogId: null,
      apexClass: {
        id: '01pxx00000O6tXZQAZ',
        name: 'TestLogger',
        namespacePrefix: 't3st',
        fullName: 't3st__TestLogger'
      },
      runTime: 8,
      testTimestamp: '3',
      fullName: 't3st__TestLogger.testLoggerLog'
    }
  ]
};
export const codeCoverageQueryResult: ApexCodeCoverageAggregateRecord[] = [
  {
    ApexClassOrTrigger: {
      Id: '01pxx00000avcNeAAL',
      Name: 'ApexClassExample'
    },
    NumLinesCovered: 0,
    NumLinesUncovered: 9,
    Coverage: {
      coveredLines: [],
      uncoveredLines: [3, 8, 10, 13, 16, 21, 22, 24, 28]
    }
  },
  {
    ApexClassOrTrigger: {
      Id: '01pxx00000avc00AAL',
      Name: 'ApexSampleV2'
    },
    NumLinesCovered: 19,
    NumLinesUncovered: 1,
    Coverage: {
      coveredLines: [
        3,
        4,
        6,
        7,
        8,
        9,
        15,
        18,
        19,
        22,
        23,
        24,
        27,
        28,
        29,
        30,
        31,
        33,
        34
      ],
      uncoveredLines: [35]
    }
  },
  {
    ApexClassOrTrigger: {
      Id: '01qxp00000av340AAL',
      Name: 'MyTestTrigger'
    },
    NumLinesCovered: 0,
    NumLinesUncovered: 0,
    Coverage: {
      coveredLines: [],
      uncoveredLines: []
    }
  }
];

export const mixedTestResults: ApexTestResultRecord[] = [
  {
    Id: '07Mxx00000ErehvUAB',
    QueueItemId: '709xx000001Il2UQAS',
    StackTrace: null,
    Message: null,
    RunTime: 1397,
    TestTimestamp: '2020-08-18T02:04:49.000+0000',
    AsyncApexJobId: '707xx0000ASIPB5QQP',
    MethodName: 'testAssignOnFuture',
    Outcome: ApexTestResultOutcome.Pass,
    ApexLogId: null,
    ApexClass: {
      Id: '01pxx00000NnP2KQAV',
      Name: 'TestAssignment',
      NamespacePrefix: null,
      FullName: 'TestAssignment'
    }
  },
  {
    Id: '07Mxx00000ErehwUAB',
    QueueItemId: '709xx000001Il2UQAS',
    StackTrace: null,
    Message: null,
    RunTime: 615,
    TestTimestamp: '2020-08-18T02:04:51.000+0000',
    AsyncApexJobId: '707xxM0000ASIPB5QQP',
    MethodName: 'testAssignOnInsert',
    Outcome: ApexTestResultOutcome.Pass,
    ApexLogId: null,
    ApexClass: {
      Id: '01pxx00000NnP2KQAV',
      Name: 'TestAssignment',
      NamespacePrefix: null,
      FullName: 'TestAssignment'
    }
  },
  {
    Id: '07Mxx00000ErehxUAB',
    QueueItemId: '709xx000001Il2UQAS',
    StackTrace: null,
    Message: null,
    RunTime: 676,
    TestTimestamp: '2020-08-18T02:04:52.000+0000',
    AsyncApexJobId: '707xx0000ASIPB5QQP',
    MethodName: 'testAssignOnUpdate',
    Outcome: ApexTestResultOutcome.Skip,
    ApexLogId: null,
    ApexClass: {
      Id: '01pxx00000NnP2KQAV',
      Name: 'TestAssignment',
      NamespacePrefix: null,
      FullName: 'TestAssignment'
    }
  },
  {
    Id: '07Mxx00000ErehyUAB',
    QueueItemId: '709xx000001Il2UQAS',
    StackTrace: null,
    Message: null,
    RunTime: 593,
    TestTimestamp: '2020-08-18T02:04:53.000+0000',
    AsyncApexJobId: '707xx0000ASIPB5QQP',
    MethodName: 'testAssignContains',
    Outcome: ApexTestResultOutcome.Pass,
    ApexLogId: null,
    ApexClass: {
      Id: '01pxx00000NnP2KQAV',
      Name: 'TestAssignment',
      NamespacePrefix: null,
      FullName: 'TestAssignment'
    }
  },
  {
    Id: '07Mxx00000EreiDUAR',
    QueueItemId: '709xx000001Il2ZQAS',
    StackTrace:
      'Class.TestAssignment.testAssignRuleContains: line 196, column 1',
    Message:
      'System.AssertException: Assertion Failed: Expected: 1, Actual: 11',
    AsyncApexJobId: '707xx0000ASIRYXQQ5',
    MethodName: 'testAssignRuleContains',
    Outcome: ApexTestResultOutcome.Fail,
    ApexLogId: null,
    ApexClass: {
      Id: '01pxx00000NnP2KQAV',
      Name: 'TestAssignment',
      NamespacePrefix: null,
      FullName: 'TestAssignment'
    },
    RunTime: 560,
    TestTimestamp: '2020-08-18T02:21:30.000+0000'
  },
  {
    Id: '07Mxx00000EreiDUAR',
    QueueItemId: '709xx000001Il2ZQAS',
    StackTrace:
      'Class.TestAssignment.testAssignRuleContainsV2: line 16, column 20',
    Message: 'System.AssertException: Assertion Failed: Expected: 1, Actual: 0',
    AsyncApexJobId: '707xx0000ASIRYXQQ5',
    MethodName: 'testAssignRuleContainsV2',
    Outcome: ApexTestResultOutcome.Fail,
    ApexLogId: null,
    ApexClass: {
      Id: '01pxx00000NnP2KQAV',
      Name: 'TestAssignment',
      NamespacePrefix: null,
      FullName: 'TestAssignment'
    },
    RunTime: 56,
    TestTimestamp: '2020-08-18T02:21:30.000+0000'
  }
];