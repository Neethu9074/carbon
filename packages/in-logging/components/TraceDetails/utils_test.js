/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  countOtelLogs,
  filterOtelLogs,
  getLogLevelAndColor,
  getCallIdFromTags
} from 'in-logging/components/TraceDetails/utils';
import { LOG_LEVEL, LOG_SPAN_ID, LOG_STREAM_NAME, OTEL_STREAM_NAME, LOG_CALL_ID } from 'in-logging/queryBuilder';
import { logLevelColors } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';

function createTag(stringValue, name) {
  return { stringValue, name };
}

describe('filterOtelLogs', () => {
  it('should filter logs correctly', () => {
    // Setup
    const call = { id: '123' };

    const logItems = [
      {
        message: 'Message',
        itemId: 1,
        timestamp: 1,
        tags: [
          createTag('124', LOG_SPAN_ID),
          createTag(OTEL_STREAM_NAME, LOG_STREAM_NAME),
          createTag('WARN', LOG_LEVEL)
        ]
      },
      {
        message: 'Message',
        itemId: 2,
        timestamp: 2,
        tags: [createTag('123', LOG_SPAN_ID), createTag('other-stream', LOG_STREAM_NAME), createTag('WARN', LOG_LEVEL)]
      },
      {
        message: 'Message',
        itemId: 3,
        timestamp: 3,
        tags: [
          createTag('123', LOG_SPAN_ID),
          createTag(OTEL_STREAM_NAME, LOG_STREAM_NAME),
          createTag('WARN', LOG_LEVEL)
        ]
      },
      {
        message: 'Message',
        itemId: 4,
        timestamp: 4,
        tags: [createTag('123', LOG_SPAN_ID), createTag('other-stream', LOG_STREAM_NAME)]
      }
    ];

    // Execute
    const result = logItems.filter(filterOtelLogs(call));

    // Assert
    expect(result).toStrictEqual([
      {
        message: 'Message',
        itemId: 3,
        timestamp: 3,
        tags: [
          createTag('123', LOG_SPAN_ID),
          createTag(OTEL_STREAM_NAME, LOG_STREAM_NAME),
          createTag('WARN', LOG_LEVEL)
        ]
      }
    ]);
  });
});

describe('getLogLevelAndColor', () => {
  it('should return correct level and color for log items', () => {
    const logs = [
      { tags: [createTag('WARN', LOG_LEVEL)], itemId: 1, timestamp: 1, message: 'Message' },
      { tags: [], itemId: 2, timestamp: 1, message: 'Message' },
      { errorCount: 1 },
      { errorCount: 0 }
    ];

    const result = logs.map(log => getLogLevelAndColor(log));

    expect(result).toStrictEqual([
      { level: 'warn', color: logLevelColors.warn },
      { level: 'unknown', color: logLevelColors.unknown },
      { level: 'error', color: logLevelColors.error },
      { level: 'warn', color: logLevelColors.warn }
    ]);
  });
});

describe('countOtelLogs', () => {
  it('should correctly count otel logs', () => {
    const logs = [
      {
        tags: [createTag('WARN', LOG_LEVEL), createTag(OTEL_STREAM_NAME, LOG_STREAM_NAME)],
        itemId: 1,
        timestamp: 1,
        message: 'Message'
      },
      {
        tags: [createTag('ERROR', LOG_LEVEL), createTag(OTEL_STREAM_NAME, LOG_STREAM_NAME)],
        itemId: 1,
        timestamp: 1,
        message: 'Message'
      },
      { tags: [createTag(OTEL_STREAM_NAME, LOG_STREAM_NAME)], itemId: 1, timestamp: 1, message: 'Message' },
      {
        tags: [createTag('WARN', LOG_LEVEL), createTag('other-stream', LOG_STREAM_NAME)],
        itemId: 1,
        timestamp: 1,
        message: 'Message'
      }
    ];

    const result = countOtelLogs(logs);

    expect(result).toStrictEqual({ warn: 1, error: 1 });
  });
});

describe('getCallIdFromTags', () => {
  it('should return the correct call ID when present in tags', () => {
    const tags = [createTag('ERROW', LOG_LEVEL), createTag('call-id-123', LOG_CALL_ID)];

    const result = getCallIdFromTags(tags);
    expect(result).toBe('call-id-123');
  });

  it('should return undefined when call ID tag is not present', () => {
    const tags = [createTag('ERROR', LOG_LEVEL)];

    const result = getCallIdFromTags(tags);
    expect(result).toBeUndefined();
  });
});
