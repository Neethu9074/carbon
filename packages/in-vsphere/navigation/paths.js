/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { datacenterId as matrixDatacenterId } from 'in-vsphere/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { hostId as matrixHostId } from 'in-vsphere/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { vmId as matrixVmId } from 'in-vsphere/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';

export const vsphere = '/vsphere';

export const datacenterList = '/datacenters';
export const datacenterListFullyQualified = `${vsphere}${datacenterList}`;
export const datacenterDashboard = `/datacenter`;
export const datacenterDashboardFullyQualified = `${vsphere}${datacenterDashboard}`;
export const hostDashboard = `/host`;
export const hostDashboardFullyQualified = `${vsphere}${hostDashboard}`;
export const vmDashboard = `/vm`;
export const vmDashboardFullyQualified = `${vsphere}${vmDashboard}`;

export function getVsphereDatacenterDashboard(datacenterId, { tab, tabMatrix, timeConfig } = emptyObject) {
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

export function getVsphereHostDashboard(hostId, { tab, tabMatrix, timeConfig, datacenterId } = emptyObject) {
  return getDashboard({
    base: hostDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: hostDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, hostDashboard, matrixDatacenterId, datacenterId);
    }
  });
}

export function getVsphereVmDashboard(vmId, { tab, tabMatrix, timeConfig, datacenterId, hostId } = emptyObject) {
  return getDashboard({
    base: vmDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: vmDashboard,
    matrixParam: matrixVmId,
    id: vmId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, vmDashboard, matrixDatacenterId, datacenterId);
      setOrDeleteMatrixKey(params, vmDashboard, matrixHostId, hostId);
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
