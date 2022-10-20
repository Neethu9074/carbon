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

interface ReducedTagFilterWithDefaults {
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

export const LOG_ITEM_ID = 'log.itemId';
export const LOG_LEVEL = 'log.level';
export const LOG_STREAM_NAME = 'log.streamName';
export const LOG_TRACE_ID = 'log.traceId';
export const LOG_SPAN_ID = 'log.spanId';
export const LOG_CALL_ID = 'log.callId';
export const LOG_MESSAGE = 'log.message';
export const LOG_CUSTOM = 'log.custom';
export const LOG_DOCKER_SNAPSHOT_ID = 'log.dockerSnapshotId';
export const LOG_PROCESS_SNAPSHOT_ID = 'log.processSnapshotId';
export const LOG_HOST_SNAPSHOT_ID = 'log.hostSnapshotId';
export const LOG_SERVICE_NAME = 'service.name';
export const LOG_MESSAGE_TIMESTAMP = 'log.tsFromMessage';

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

export const LOG_CUSTOM_KEY_SERVICE_ID = 'service_id';
export const LOG_CUSTOM_KEY_ENDPOINT_ID = 'endpoint_id';
export const LOG_CUSTOM_KEY_APPLICATION_IDS = 'application_ids';
export const LOG_CUSTOM_KEY_APPLICATION_ID = 'application_id';
export const LOG_CUSTOM_KEY_ENDPOINT_NAME = 'endpoint_name';
export const LOG_CUSTOM_KEY_ENDPOINT_TYPE = 'endpoint_type';
export const LOG_CUSTOM_KEY_MSG_PARAM = '_msg_param';

export const ID_KUBERNETES_CLUSTER = 'id.kubernetesCluster';
export const ID_KUBERNETES_POD = 'id.kubernetesPod';
export const ID_KUBERNETES_NODE = 'id.kubernetesNode';
export const ID_KUBERNETES_NAMESPACE = 'id.kubernetesNamespace';
export const ID_KUBERNETES_DEPLOYMENT = 'id.kubernetesDeployment';
export const ID_DOCKER = 'id.docker';

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
  ID_KUBERNETES_CLUSTER,
  ID_KUBERNETES_POD,
  ID_KUBERNETES_NODE,
  ID_KUBERNETES_NAMESPACE,
  ID_KUBERNETES_DEPLOYMENT,
  KUBERNETES_CLUSTER_SNAPSHOT_ID,
  ...kubernetesEntitySnapshotIds
];

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
  LOG_PROCESS_SNAPSHOT_ID,
  LOG_DOCKER_SNAPSHOT_ID,
  LOG_HOST_SNAPSHOT_ID,
  LOG_EXCEPTION_TYPE,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE,
  ID_DOCKER,
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
  ID_KUBERNETES_CLUSTER,
  ID_KUBERNETES_POD,
  ID_KUBERNETES_NODE,
  ID_KUBERNETES_NAMESPACE,
  ID_KUBERNETES_DEPLOYMENT,
  ID_DOCKER,
  ...kubernetesEntitySnapshotIds
]);
