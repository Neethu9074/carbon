/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// import { hostId as matrixHostId } from 'in-vsphere/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
// import { vmId as matrixVmId } from 'in-vsphere/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';
import { regionId as matrixRegionId } from 'in-openstack/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setTimeConfig } from 'in-stores/time/config';

export const openstack = '/openstack';

export const regionList = '/regions';
export const regionListFullyQualified = `${openstack}${regionList}`;
export const regionDashboard = `/region`;
export const regionDashboardFullyQualified = `${openstack}${regionDashboard}`;

export function getOpenstackRegionDashboard(regionId, { tab, tabMatrix, timeConfig } = emptyObject) {
  return getDashboard({
    base: regionDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: regionDashboard,
    matrixParam: matrixRegionId,
    id: regionId
  });
}

function getDashboard({
  base,
  tab = '/summary',
  tabMatrix = {},
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
