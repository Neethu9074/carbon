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
export const serviceDashboard = `${kubernetes}/service`;

export const clusterList = `${kubernetes}/clusters`;
export const clusterDashboard = `${kubernetes}/cluster`;

export const namespaceList = `${kubernetes}/namespaces`;
export const namespaceDashboard = `${kubernetes}/namespace`;

export const podDashboard = `${kubernetes}/pod`;

export function getServiceDashboard(serviceId, { tab, tabMatrix, timeConfig } = emptyObject) {
  return getDashboard(
    {
      base: serviceDashboard,
      tab,
      tabMatrix,
      timeConfig
    },
    serviceId,
    matrixServiceId
  );
}
export function getClusterDashboard(clusterId, { tab, tabMatrix, timeConfig } = emptyObject) {
  return getDashboard(
    {
      base: clusterDashboard,
      tab,
      tabMatrix,
      timeConfig
    },
    clusterId,
    matrixClusterId
  );
}

export function getNamespaceDashboard(namespaceId, { tab, tabMatrix, timeConfig } = emptyObject) {
  return getDashboard(
    {
      base: namespaceDashboard,
      tab,
      tabMatrix,
      timeConfig
    },
    namespaceId,
    matrixNamespaceId
  );
}

export function getPodDashboard(podId, { tab, tabMatrix, timeConfig } = emptyObject) {
  return getDashboard(
    {
      base: podDashboard,
      tab,
      tabMatrix,
      timeConfig
    },
    podId,
    matrixPodId
  );
}

function getDashboard({ base, tab = '/summary', tabMatrix = emptyObject, timeConfig }, id, matrixParameter) {
  return getModifiedUrlStream(params => {
    params.pathname = `${base}${tab}`;
    setOrDeleteMatrixKey(params, base, matrixParameter, id);

    if (timeConfig != null) {
      setTimeConfig(params, timeConfig);
    }

    params.matrix[tab] = tabMatrix;
  });
}
