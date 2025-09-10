/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { LogItem } from '@instana/types';

import { getLogMessageWithParams } from 'in-logging/analyze/ConsoleView/utils';

describe('getLogMessageWithParams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly format log message with parameters', () => {
    const mockLog: LogItem = {
      itemId: '1861C857C4E1178023CBE1B69B612ED11861C857C4E117800000000000000007',
      timestamp: 1756905608942,
      message: 'Failed to notify {} of event {} on the {} integration channel with id {} due to {}',
      tags: [
        {
          name: 'log.level',
          stringValue: 'WARN'
        },
        {
          name: 'log.custom',
          key: '_msg_param0',
          stringValue: 'change'
        },
        {
          name: 'log.custom',
          key: '_msg_param1',
          stringValue: 'u5-zVsj8R9aauic-JyaLFQ'
        },
        {
          name: 'log.custom',
          key: '_msg_param2',
          stringValue: 'WEB_HOOK'
        },
        {
          name: 'log.custom',
          key: '_msg_param3',
          stringValue: 'uMiJMd1wBDpEqnO3'
        },
        {
          name: 'log.custom',
          key: '_msg_param4',
          stringValue:
            "Failed to send message to Custom Webhook 'https://webhook.site/5d65d57c-8fbf-43dd-98f8-8706ef0bdf34' with status code: 429. Reason: Too many requests"
        },
        {
          name: 'log.custom',
          key: 'application_ids',
          stringValue: '7c2mCYl4SiaWAXC8jhJTrQ,9b9BtSmlSOitOI2g1DDsLA'
        }
      ]
    };

    const result = getLogMessageWithParams(mockLog);

    expect(result).toBe(
      "Failed to notify change of event u5-zVsj8R9aauic-JyaLFQ on the WEB_HOOK integration channel with id uMiJMd1wBDpEqnO3 due to Failed to send message to Custom Webhook 'https://webhook.site/5d65d57c-8fbf-43dd-98f8-8706ef0bdf34' with status code: 429. Reason: Too many requests"
    );
  });

  it('should handle log without parameters', () => {
    const mockLog: LogItem = {
      itemId: 'test-id',
      timestamp: 1756905608942,
      message: 'Simple log message without parameters',
      tags: [
        {
          name: 'log.level',
          stringValue: 'INFO'
        }
      ]
    };

    const result = getLogMessageWithParams(mockLog);

    expect(result).toBe('Simple log message without parameters');
  });

  it('should handle log with missing parameter values', () => {
    const mockLog: LogItem = {
      itemId: 'test-id',
      timestamp: 1756905608942,
      message: 'Message with {} placeholder but no parameter',
      tags: [
        {
          name: 'log.level',
          stringValue: 'INFO'
        }
      ]
    };

    const result = getLogMessageWithParams(mockLog);

    expect(result).toBe('Message with  placeholder but no parameter');
  });
});
