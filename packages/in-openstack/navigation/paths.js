/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { hypervisorId as matrixHypervisorId } from 'in-openstack/navigation/matrix';
import { instanceId as matrixInstanceId } from 'in-openstack/navigation/matrix';
import { regionId as matrixRegionId } from 'in-openstack/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';

export const openstack = '/openstack';

export const regionList = '/regions';
export const regionListFullyQualified = `${openstack}${regionList}`;
export const regionDashboard = `/region`;
export const regionDashboardFullyQualified = `${openstack}${regionDashboard}`;
export const hypervisorDashboard = `/hypervisor`;
export const hypervisorDashboardFullyQualified = `${openstack}${hypervisorDashboard}`;
export const instanceDashboard = `/instance`;
export const instanceDashboardFullyQualified = `${openstack}${instanceDashboard}`;

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
export function getOpenstackHypervisorDashboard(hypervisorId, { tab, tabMatrix, timeConfig, regionId } = emptyObject) {
  return getDashboard({
    base: hypervisorDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: hypervisorDashboard,
    matrixParam: matrixHypervisorId,
    id: hypervisorId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, hypervisorDashboard, matrixRegionId, regionId);
    }
  });
}
export function getOpenstackInstanceDashboard(instanceId, { tab, tabMatrix, timeConfig, regionId } = emptyObject) {
  return getDashboard({
    base: instanceDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: instanceDashboard,
    matrixParam: matrixInstanceId,
    id: instanceId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, instanceDashboard, matrixRegionId, regionId);
    }
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
