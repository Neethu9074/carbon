/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export function getTraceIdTagFilter(traceId) {
  // Until the transition to 128bit trace IDs is complete, only the ID's last 64 bits should
  // be used for finding traces by ID
  traceId = traceId.slice(-16);
  return { type: 'TAG_FILTER', name: 'log.traceId', value: traceId, operator: 'ENDS_WITH' };
}
