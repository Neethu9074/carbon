/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import emptyTagFilterExpression from 'in-new-components/QueryBuilder/tagFilter/emptyTagFilterExpression';

export function getTraceIdTagFilter(traceId) {
  // Until the transition to 128bit trace IDs is complete, only the ID's last 64 bits should
  // be used for finding traces by ID
  traceId = traceId.slice(-16);
  return getValueMatchTagFilter(LOG_TRACE_ID, traceId, 'ENDS_WITH');
}

export function getSpanIdTagFilter(spanId) {
  return spanId ? getValueMatchTagFilter(LOG_SPAN_ID, spanId) : emptyTagFilterExpression;
}

export function getValueMatchTagFilter(name, value, operator = 'EQUALS') {
  return { type: 'TAG_FILTER', operator, name, value };
}

export const LOG_LEVEL = 'log.level';
export const LOG_STREAM_NAME = 'log.streamName';
export const LOG_TRACE_ID = 'log.traceId';
export const LOG_SPAN_ID = 'log.spanId';
export const LOG_MESSAGE = 'log.message';
export const LOG_CUSTOM = 'log.custom';
export const LOG_DOCKER_SNAPSHOT_ID = 'log.dockerSnapshotId';
