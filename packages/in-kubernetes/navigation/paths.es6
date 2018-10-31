import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';

import {
  serviceId as matrixServiceId,
  clusterId as matrixClusterId,
  namespaceId as matrixNamespaceId,
  podId as matrixPodId
} from 'in-kubernetes/navigation/matrix';

export const kubernetes = '/kubernetes';

export const serviceList = `${kubernetes}/services`;
export const serviceDashboard = `/service`;
export const serviceDashboardFullyQualified = `${kubernetes}${serviceDashboard}`;

export const clusterList = `${kubernetes}/clusters`;
export const clusterDashboard = `/cluster`;
export const clusterDashboardFullyQualified = `${kubernetes}${clusterDashboard}`;

export const namespaceList = `${kubernetes}/namespaces`;
export const namespaceDashboard = `/namespace`;
export const namespaceDashboardFullyQualified = `${kubernetes}${namespaceDashboard}`;

export const podDashboard = `/pod`;
export const podDashboardFullyQualified = `${kubernetes}${podDashboard}`;

export function getServiceDashboard(serviceId, { tab, tabMatrix, timeConfig } = emptyObject) {
  return getDashboard({
    base: serviceDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: serviceDashboard,
    matrixParam: matrixServiceId,
    id: serviceId
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

export function getNamespaceDashboard(namespaceId, { tab, tabMatrix, timeConfig } = emptyObject) {
  return getDashboard({
    base: namespaceDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: namespaceDashboard,
    matrixParam: matrixNamespaceId,
    id: namespaceId
  });
}

export function getPodDashboard(podId, { tab, tabMatrix, timeConfig } = emptyObject) {
  return getDashboard({
    base: podDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: podDashboard,
    matrixParam: matrixPodId,
    id: podId
  });
}

function getDashboard({ base, tab = '/summary', tabMatrix = emptyObject, timeConfig, matrixSegment, matrixParam, id }) {
  return getModifiedUrlStream(params => {
    params.pathname = `${base}${tab}`;

    setOrDeleteMatrixKey(params, matrixSegment, matrixParam, id);

    if (timeConfig != null) {
      setTimeConfig(params, timeConfig);
    }

    params.matrix[tab] = tabMatrix;
  });
}
