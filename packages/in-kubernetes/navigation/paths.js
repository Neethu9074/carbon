import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';
import { kubernetesPlugins } from '../constants.js';
import {
  serviceId as matrixServiceId,
  clusterId as matrixClusterId,
  namespaceId as matrixNamespaceId,
  podId as matrixPodId,
  nodeId as matrixNodeId,
  deploymentId as matrixDeploymentId,
  deploymentConfigId as matrixDeploymentConfigId
} from 'in-kubernetes/navigation/matrix';

export const kubernetes = '/kubernetes';

export const serviceDashboard = `/service`;
export const serviceDashboardFullyQualified = `${kubernetes}${serviceDashboard}`;
export const serviceDashboardDetailsFullyQualified = `${serviceDashboardFullyQualified}/details`;

export const clusterList = '/clusters';
export const clusterListFullyQualified = `${kubernetes}${clusterList}`;
export const clusterDashboard = `/cluster`;
export const clusterDashboardFullyQualified = `${kubernetes}${clusterDashboard}`;
export const clusterDashboardDetailsFullyQualified = `${clusterDashboardFullyQualified}/details`;

export const namespaceList = '/namespaces';
export const namespaceListFullyQualified = `${kubernetes}${namespaceList}`;
export const namespaceDashboard = `/namespace`;
export const namespaceDashboardFullyQualified = `${kubernetes}${namespaceDashboard}`;
export const namespaceDashboardDetailsFullyQualified = `${namespaceDashboardFullyQualified}/details`;

export const podDashboard = `/pod`;
export const podDashboardFullyQualified = `${kubernetes}${podDashboard}`;
export const podDashboardDetailsFullyQualified = `${podDashboardFullyQualified}/details`;

export const nodeDashboard = `/node`;
export const nodeDashboardFullyQualified = `${kubernetes}${nodeDashboard}`;
export const nodeDashboardDetailsFullyQualified = `${nodeDashboardFullyQualified}/details`;

export const deploymentDashboard = `/deployment`;
export const deploymentDashboardFullyQualified = `${kubernetes}${deploymentDashboard}`;
export const deploymentDashboardDetailsFullyQualified = `${deploymentDashboardFullyQualified}/details`;

export const deploymentConfigDashboard = `/deploymentconfig`;
export const deploymentConfigDashboardFullyQualified = `${kubernetes}${deploymentConfigDashboard}`;
export const deploymentConfigDashboardDetailsFullyQualified = `${deploymentConfigDashboardFullyQualified}/details`;

export function getServiceDashboard(serviceId, { tab, tabMatrix, timeConfig, namespaceId, clusterId } = emptyObject) {
  return getDashboard({
    base: serviceDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: serviceDashboard,
    matrixParam: matrixServiceId,
    id: serviceId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, serviceDashboard, matrixNamespaceId, namespaceId);
      setOrDeleteMatrixKey(params, serviceDashboard, matrixClusterId, clusterId);
    }
  });
}
export function getClusterDashboard(clusterId, { tab, tabMatrix, timeConfig } = emptyObject) {
  return getDashboard({
    base: clusterDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: clusterDashboard,
    matrixParam: matrixClusterId,
    id: clusterId
  });
}

export function getNamespaceDashboard(namespaceId, { tab, tabMatrix, timeConfig, clusterId } = emptyObject) {
  return getDashboard({
    base: namespaceDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: namespaceDashboard,
    matrixParam: matrixNamespaceId,
    id: namespaceId,
    paramsCallback: params => setOrDeleteMatrixKey(params, namespaceDashboard, matrixClusterId, clusterId)
  });
}

export function getPodDashboard(
  podId,
  { tab, tabMatrix, timeConfig, clusterId, namespaceId, deploymentId, nodeId } = emptyObject
) {
  return getDashboard({
    base: podDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: podDashboard,
    matrixParam: matrixPodId,
    id: podId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, podDashboard, matrixClusterId, clusterId);
      setOrDeleteMatrixKey(params, podDashboard, matrixNamespaceId, namespaceId);
      setOrDeleteMatrixKey(params, podDashboard, matrixDeploymentId, deploymentId);
      setOrDeleteMatrixKey(params, podDashboard, matrixNodeId, nodeId);
    }
  });
}

export function getNodeDashboard(nodeId, { tab, tabMatrix, timeConfig, clusterId } = emptyObject) {
  return getDashboard({
    base: nodeDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: nodeDashboard,
    matrixParam: matrixNodeId,
    id: nodeId,
    paramsCallback: params => setOrDeleteMatrixKey(params, nodeDashboard, matrixClusterId, clusterId)
  });
}

export function getDeploymentDashboard(
  deploymentId,
  { tab, tabMatrix, timeConfig, clusterId, namespaceId } = emptyObject
) {
  return getDashboard({
    base: deploymentDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: deploymentDashboard,
    matrixParam: matrixDeploymentId,
    id: deploymentId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, deploymentDashboard, matrixClusterId, clusterId);
      setOrDeleteMatrixKey(params, deploymentDashboard, matrixNamespaceId, namespaceId);
    }
  });
}

export function getDeploymentConfigDashboard(
  deploymentConfigId,
  { tab, tabMatrix, timeConfig, clusterId, namespaceId } = emptyObject
) {
  return getDashboard({
    base: deploymentConfigDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: deploymentConfigDashboard,
    matrixParam: matrixDeploymentConfigId,
    id: deploymentConfigId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, deploymentConfigDashboard, matrixClusterId, clusterId);
      setOrDeleteMatrixKey(params, deploymentConfigDashboard, matrixNamespaceId, namespaceId);
    }
  });
}

export function getDashboardForEntity(snapshotId, plugin) {
  switch (plugin) {
    case kubernetesPlugins.pod:
      return getPodDashboard(snapshotId);
    case kubernetesPlugins.service:
      return getServiceDashboard(snapshotId);
    case kubernetesPlugins.deployment:
      return getDeploymentDashboard(snapshotId);
    case kubernetesPlugins.namespace:
      return getNamespaceDashboard(snapshotId);
    case kubernetesPlugins.cluster:
      return getClusterDashboard(snapshotId);
  }
}

function getDashboard({
  base,
  tab = '/summary',
  tabMatrix = emptyObject,
  timeConfig,
  matrixSegment,
  matrixParam,
  id,
  paramsCallback
}) {
  return getModifiedUrlStream(params => {
    params.pathname = `${base}${tab}`;

    setOrDeleteMatrixKey(params, matrixSegment, matrixParam, id);

    if (timeConfig != null) {
      setTimeConfig(params, timeConfig);
    }

    params.matrix[tab] = tabMatrix;

    if (paramsCallback) {
      paramsCallback(params);
    }
  });
}
