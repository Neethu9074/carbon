/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getEmptyTagFilterExpression } from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { EQUALS, NOT_EMPTY, ENDS_WITH } from 'in-components/QueryBuilder/tagFilter/operators';
import { sanitizeTagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { TagFilter } from 'in-types';

export function getTraceIdTagFilter(traceId: string): TagFilter {
  // Until the transition to 128bit trace IDs is complete, only the ID's last 64 bits should
  // be used for finding traces by ID
  traceId = traceId.slice(-16);
  return getValueMatchTagFilter({ name: LOG_TRACE_ID, value: traceId, operator: ENDS_WITH, type: 'STRING' });
}

export function getSpanIdTagFilter(spanId: string) {
  return spanId
    ? getValueMatchTagFilter({ name: LOG_SPAN_ID, value: spanId, operator: EQUALS, type: 'STRING' })
    : getEmptyTagFilterExpression();
}

export function getValueMatchTagFilter(tagFilter: TagFilter) {
  const { name, key, value, operator = EQUALS, type = 'TAG_FILTER' } = tagFilter;
  return sanitizeTagFilter(
    type === 'KEY_VALUE_PAIR' && !key
      ? { type, operator: NOT_EMPTY, name, key: value }
      : { type, operator, name, key, value }
  );
}

export const LOG_LEVEL = 'log.level';
export const LOG_STREAM_NAME = 'log.streamName';
export const LOG_TRACE_ID = 'log.traceId';
export const LOG_SPAN_ID = 'log.spanId';
export const LOG_MESSAGE = 'log.message';
export const LOG_CUSTOM = 'log.custom';
export const LOG_DOCKER_SNAPSHOT_ID = 'log.dockerSnapshotId';
export const LOG_PROCESS_SNAPSHOT_ID = 'log.processSnapshotId';
export const LOG_HOST_SNAPSHOT_ID = 'log.hostSnapshotId';
export const LOG_SERVICE_NAME = 'service.name';

export const LOG_CUSTOM_KEY_SERVICE_ID = 'service_id';
export const LOG_CUSTOM_KEY_ENDPOINT_ID = 'endpoint_name';
