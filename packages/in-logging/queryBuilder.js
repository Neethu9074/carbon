/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export function getTraceIdTagFilter(traceId) {
  return { type: 'TAG_FILTER', name: 'log.traceId', value: traceId.padStart(32, '0'), operator: 'EQUALS' };
}
