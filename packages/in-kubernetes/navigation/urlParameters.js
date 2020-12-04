import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';

import {
  clusterDashboard,
  serviceDashboard,
  namespaceDashboard,
  podDashboard,
  nodeDashboard,
  daemonSetDashboard,
  deploymentDashboard,
  deploymentConfigDashboard,
  statefulSetDashboard,
  cronJobDashboard
} from 'in-kubernetes/navigation/paths';

import {
  clusterId,
  serviceId,
  namespaceId,
  podId,
  nodeId,
  cronJobId,
  daemonSetId,
  deploymentId,
  deploymentConfigId,
  statefulSetId
} from 'in-kubernetes/navigation/matrix';

export const clusterIdUrlParameter = {
  path: clusterDashboard,
  name: clusterId
};

export const serviceIdUrlParameter = {
  path: serviceDashboard,
  name: serviceId
};

export const namespaceIdUrlParameter = {
  path: namespaceDashboard,
  name: namespaceId
};

export const podIdUrlParameter = {
  path: podDashboard,
  name: podId
};

export const nodeIdUrlParameter = {
  path: nodeDashboard,
  name: nodeId
};

export const cronJobIdUrlParameter = {
  path: cronJobDashboard,
  name: cronJobId
};

export const daemonSetIdUrlParameter = {
  path: daemonSetDashboard,
  name: daemonSetId
};

export const statefulSetIdUrlParameter = {
  path: statefulSetDashboard,
  name: statefulSetId
};

export const deploymentIdUrlParameter = {
  path: deploymentDashboard,
  name: deploymentId
};

export const deploymentConfigIdUrlParameter = {
  path: deploymentConfigDashboard,
  name: deploymentConfigId
};

export const phasePodListUrlParameter = {
  path: '/pods',
  name: 'pod.phase',
  as: 'phase',
  initialState: null,
  parser: buildJsonParser(null),
  serializer: buildJsonSerializer()
};
