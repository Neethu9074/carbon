/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getCardTitle } from 'in-logging/components/TraceDetails/components/LogDetails/utils';
import { LOG_LEVEL } from 'in-logging/queryBuilder';

describe('getCardTitle', () => {
  it('should return correct title for LogItems with errors and warnings', () => {
    const getTag = stringValue => ({ stringValue, name: LOG_LEVEL });

    const inputLogs = [
      [{ tags: [getTag('ERROR')] }],
      [{ tags: [getTag('WARN')] }],
      [{ tags: [getTag('ERROR')] }, { tags: [getTag('WARN')] }],
      [{ tags: [getTag('ERROR')] }, { tags: [getTag('ERROR')] }, { tags: [getTag('WARN')] }],
      [{ tags: [getTag('ERROR')] }, { tags: [getTag('ERROR')] }, { tags: [getTag('WARN')] }, { tags: [getTag('WARN')] }]
    ];

    const titles = inputLogs.map(inputLog => getCardTitle(inputLog));

    expect(titles).toStrictEqual([
      '1 error',
      '1 warning',
      '1 error, 1 warning',
      '2 errors, 1 warning',
      '2 errors, 2 warnings'
    ]);
  });
});

describe('getCardTitle', () => {
  it('should return correct title for LogSpanExcerpts with errors and warnings', () => {
    const inputLogs = [
      [{ data: { log: { level: 'ERROR' } } }],
      [{ errorCount: 1, data: {} }],
      [{ errorCount: 0, data: {} }],
      [{ data: { log: { level: 'WARN' } } }, { errorCount: 0, data: {} }, { errorCount: 1, data: {} }]
    ];

    const titles = inputLogs.map(inputLog => getCardTitle(inputLog));

    expect(titles).toStrictEqual(['1 error', '1 error', '1 warning', '1 error, 2 warnings']);
  });
});
