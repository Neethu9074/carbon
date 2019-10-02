import { clusterId as matrixClusterId } from 'in-vsphere/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';

export const cloudfoundry = '/vsphere';

export const clusterList = '/clusters';
export const clusterListFullyQualified = `${cloudfoundry}${clusterList}`;
export const clusterDashboard = `/cluster`;
export const clusterDashboardFullyQualified = `${cloudfoundry}${clusterDashboard}`;

export function getVSphereDashboard(clusterId, { tab, tabMatrix, timeConfig } = emptyObject) {
  return getDashboard({
    base: clusterListFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: clusterDashboardFullyQualified,
    matrixParam: matrixClusterId,
    id: clusterId
  });
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
