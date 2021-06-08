/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import emptyTagFilterExpression from 'in-new-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { sanitizeTagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';

export function getTraceIdTagFilter(traceId) {
  // Until the transition to 128bit trace IDs is complete, only the ID's last 64 bits should
  // be used for finding traces by ID
  traceId = traceId.slice(-16);
  return getValueMatchTagFilter({ name: LOG_TRACE_ID, value: traceId, operator: 'ENDS_WITH' });
}

export function getSpanIdTagFilter(spanId) {
  return spanId ? getValueMatchTagFilter({ name: LOG_SPAN_ID, value: spanId }) : emptyTagFilterExpression;
}

export function getValueMatchTagFilter(tagFilter) {
  const { name, key, value, operator = EQUALS, type = 'TAG_FILTER' } = tagFilter;
  return sanitizeTagFilter({ type, operator, name, key, value });
}

export const LOG_LEVEL = 'log.level';
export const LOG_STREAM_NAME = 'log.streamName';
export const LOG_TRACE_ID = 'log.traceId';
export const LOG_SPAN_ID = 'log.spanId';
export const LOG_MESSAGE = 'log.message';
export const LOG_CUSTOM = 'log.custom';
export const LOG_DOCKER_SNAPSHOT_ID = 'log.dockerSnapshotId';
