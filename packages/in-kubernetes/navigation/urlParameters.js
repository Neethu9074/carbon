import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';

import {
  clusterDashboard,
  serviceDashboard,
  namespaceDashboard,
  podDashboard,
  nodeDashboard,
  deploymentDashboard,
  deploymentConfigDashboard
} from 'in-kubernetes/navigation/paths';

import {
  clusterId,
  serviceId,
  namespaceId,
  podId,
  nodeId,
  deploymentId,
  deploymentConfigId
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
