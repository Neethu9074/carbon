import { datacenterId as matrixDatacenterId } from 'in-vsphere/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';

export const vsphere = '/vsphere';

export const datacenterList = '/datacenters';
export const datacenterListFullyQualified = `${vsphere}${datacenterList}`;
export const datacenterDashboard = `/datacenter`;
export const datacenterDashboardFullyQualified = `${vsphere}${datacenterDashboard}`;

export function getVSphereDatacenterDashboard(datacenterId, { tab, tabMatrix, timeConfig } = emptyObject) {
  return getDashboard({
    base: datacenterDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: datacenterDashboard,
    matrixParam: matrixDatacenterId,
    id: datacenterId
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
