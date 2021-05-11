/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

const leadingZeros = '0000000000000000';
export function getTraceIdTagFilter(traceId) {
  if (traceId.length === 32 && traceId.startsWith(leadingZeros)) {
    traceId = traceId.slice(leadingZeros.length);
  }
  return { type: 'TAG_FILTER', name: 'log.traceId', value: traceId, operator: 'CONTAINS' };
}
