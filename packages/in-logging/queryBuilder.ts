/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { sanitizeTagFilter, type as TAG_FILTER_TYPE } from 'in-components/QueryBuilder/transformation/tagFilter';
import { getEmptyTagFilterExpression } from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { ENDS_WITH, EQUALS, NOT_EMPTY } from 'in-components/QueryBuilder/tagFilter/operators';
import { TagFilter, TagFilterEntity, TagFilterOperator } from 'in-types';

export function getTraceIdTagFilter(traceId: string): TagFilter {
  // Until the transition to 128bit trace IDs is complete, only the ID's last 64 bits should
  // be used for finding traces by ID
  traceId = traceId.slice(-16);
  return getValueMatchTagFilter({
    name: LOG_TRACE_ID,
    value: traceId,
    operator: ENDS_WITH,
    type: TAG_FILTER_TYPE
  });
}

export function getSpanIdTagFilter(spanId: string) {
  return spanId
    ? getValueMatchTagFilter({
        name: LOG_SPAN_ID,
        value: spanId,
        operator: EQUALS,
        type: TAG_FILTER_TYPE
      })
    : getEmptyTagFilterExpression();
}

export function getCallIdTagFilter(callId: string) {
  return callId
    ? getValueMatchTagFilter({
        name: LOG_CALL_ID,
        value: callId,
        operator: EQUALS,
        type: TAG_FILTER_TYPE
      })
    : getEmptyTagFilterExpression();
}

export interface ReducedTagFilterWithDefaults {
  name: string;
  value: string;
  key?: string;
  operator?: TagFilterOperator;
  type?: typeof TAG_FILTER_TYPE;
  entity?: TagFilterEntity;
}

export function getValueMatchTagFilter(tagFilter: ReducedTagFilterWithDefaults): TagFilter {
  const { name, key, value, operator = EQUALS, type = TAG_FILTER_TYPE, entity = 'NOT_APPLICABLE' } = tagFilter;
  return sanitizeTagFilter(
    key ? { type, operator: NOT_EMPTY, name, key: value, entity } : { type, operator, name, value, entity }
  );
}

export function getValueMatchTagFilterWithKey(tagFilter: ReducedTagFilterWithDefaults): TagFilter {
  const { name, key, value, operator = EQUALS, type = TAG_FILTER_TYPE, entity = 'NOT_APPLICABLE' } = tagFilter;
  return sanitizeTagFilter({ type, operator: operator, name, key: key, entity, value: value });
}

export const LOG_ITEM_ID = 'log.itemId';
export const LOG_LEVEL = 'log.level';
export const LOG_STREAM_NAME = 'log.streamName';
export const LOG_TRACE_ID = 'log.traceId';
export const LOG_SPAN_ID = 'log.spanId';
export const LOG_CALL_ID = 'log.callId';
export const LOG_MESSAGE = 'log.message';
export const LOG_CUSTOM = 'log.custom';
export const LOG_SERVICE_NAME = 'service.name';
export const LOG_MESSAGE_TIMESTAMP = 'log.tsFromMessage';
export const LOG_FILE_PATH = 'log.file.path';

export const LOG_KUBERNETES_CLUSTER_NAME = 'kubernetes.cluster.name';
export const LOG_KUBERNETES_NODE_NAME = 'kubernetes.node.name';
export const LOG_KUBERNETES_NAMESPACE_NAME = 'kubernetes.namespace.name';
export const LOG_KUBERNETES_DEPLOYMENT_NAME = 'kubernetes.deployment.name';
export const LOG_KUBERNETES_POD_NAME = 'kubernetes.pod.name';

export const KUBERNETES_CLUSTER_SNAPSHOT_ID = 'id.kubernetesCluster';
export const KUBERNETES_NODE_SNAPSHOT_ID = 'id.kubernetesNode';
export const KUBERNETES_POD_SNAPSHOT_ID = 'id.kubernetesPod';
export const KUBERNETES_DEPLOYMENT_SNAPSHOT_ID = 'id.kubernetesDeployment';
export const KUBERNETES_NAMESPACE_SNAPSHOT_ID = 'id.kubernetesNamespace';

export const LOG_EXCEPTION_TYPE = 'log.exception.type';
export const LOG_EXCEPTION_MESSAGE = 'log.exception.message';
export const LOG_EXCEPTION_STACK_TRACE = 'log.exception.stackTrace';
export const LOG_RETENTION_TIME = 'expiration.ts.seconds';

export const LOG_CUSTOM_KEY_SERVICE_ID = 'service_id';
export const LOG_CUSTOM_KEY_ENDPOINT_ID = 'endpoint_id';
export const LOG_CUSTOM_KEY_APPLICATION_IDS = 'application_ids';
export const LOG_CUSTOM_KEY_APPLICATION_ID = 'application_id';
export const LOG_CUSTOM_KEY_ENDPOINT_NAME = 'endpoint_name';
export const LOG_CUSTOM_KEY_ENDPOINT_TYPE = 'endpoint_type';
export const LOG_CUSTOM_KEY_MSG_PARAM = '_msg_param';

export const DOCKER_SNAPSHOT_ID = 'id.docker';
export const CONTAINERD_SNAPSHOT_ID = 'id.containerd';
export const ID_HOST = 'id.host';
export const ID_PROCESS = 'id.process';
export const CRIO_SNAPSHOT_ID = 'id.crio';
export const GARDEN_SNAPSHOT_ID = 'id.garden';

export const HOST_NAME = 'host.name';
export const PROCESS_ID = 'process.id';
export const CONTAINERD_ID = 'containerd.containerId';
export const DOCKER_ID = 'docker.containerId';
export const CRIO_ID = 'crio.containerId';
export const GARDEN_ID = 'garden.containerId';
export const containerSnapshotIds = [DOCKER_SNAPSHOT_ID, CRIO_SNAPSHOT_ID, CONTAINERD_SNAPSHOT_ID, GARDEN_SNAPSHOT_ID];
export const containerIds = [CONTAINERD_ID, DOCKER_ID, CRIO_ID, GARDEN_ID];
export const SPAN_STACK_TRACE = 'span.stacktrace';

export const kubernetesEntitySnapshotIds = [
  KUBERNETES_CLUSTER_SNAPSHOT_ID,
  KUBERNETES_NODE_SNAPSHOT_ID,
  KUBERNETES_POD_SNAPSHOT_ID,
  KUBERNETES_DEPLOYMENT_SNAPSHOT_ID,
  KUBERNETES_NAMESPACE_SNAPSHOT_ID
];

export const kubernetesTags = [
  LOG_KUBERNETES_CLUSTER_NAME,
  LOG_KUBERNETES_NODE_NAME,
  LOG_KUBERNETES_NAMESPACE_NAME,
  LOG_KUBERNETES_DEPLOYMENT_NAME,
  LOG_KUBERNETES_POD_NAME,
  ...kubernetesEntitySnapshotIds
];

/** Fetching each additional tag has a significant performance impact,
 * make sure there's a good reason for requesting additional tags **/
export const logTableTags = [
  LOG_ITEM_ID,
  LOG_LEVEL,
  LOG_STREAM_NAME,
  LOG_MESSAGE,
  LOG_MESSAGE_TIMESTAMP,
  LOG_CUSTOM,
  LOG_TRACE_ID,
  LOG_SPAN_ID,
  LOG_CALL_ID,
  LOG_EXCEPTION_TYPE,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE,
  ID_HOST,
  ID_PROCESS,
  PROCESS_ID,
  HOST_NAME,
  LOG_FILE_PATH,
  LOG_RETENTION_TIME,
  ...containerSnapshotIds,
  ...containerIds,
  ...kubernetesTags
];

export const restrictedTags = new Set<string>([
  LOG_CUSTOM_KEY_SERVICE_ID,
  LOG_EXCEPTION_TYPE,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE,
  LOG_CUSTOM_KEY_ENDPOINT_ID,
  LOG_SPAN_ID,
  LOG_CALL_ID,
  PROCESS_ID,
  HOST_NAME,
  ...containerIds,
  ...kubernetesEntitySnapshotIds
]);

export const OTEL_STREAM_NAME = 'opentelemetry-stream';
