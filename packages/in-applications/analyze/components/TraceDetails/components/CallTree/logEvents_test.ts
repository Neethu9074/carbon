/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { expect } from 'chai';

import { convertLogEventsToLogs } from 'in-applications/analyze/components/TraceDetails/components/CallTree/logEvents';

describe('in-applications/analyze/components/TraceDetails/components/CallTree/logEvents', () => {
  it('merge warn and error log events with the same timestamp', () => {
    const converted = convertLogEventsToLogs([
      {
        message: 'Watch out!',
        level: 'WARN',
        timestamp: 1677656250669,
        batchCount: 1
      },
      {
        message: 'Boom!!!',
        level: 'ERROR',
        timestamp: 1677656250669,
        batchCount: 1
      },
      {
        message: 'Error 1',
        level: 'ERROR',
        timestamp: 1677656250682,
        batchCount: 1
      },
      {
        message: 'Warn 1',
        level: 'WARN',
        timestamp: 1677656250690,
        batchCount: 1
      }
    ]);

    expect(converted).to.deep.equal([
      {
        batchCount: 2,
        errorCount: 0,
        label: 'Boom!!!',
        start: 1677656250669
      },
      {
        batchCount: 1,
        errorCount: 1,
        label: 'Error 1',
        start: 1677656250682
      },
      {
        batchCount: 1,
        errorCount: 0,
        label: 'Warn 1',
        start: 1677656250690
      }
    ]);
  });

  it('handle undefined', () => {
    const converted = convertLogEventsToLogs(undefined);
    expect(converted).to.deep.equal([]);
  });
});
