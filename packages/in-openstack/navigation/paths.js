/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { useCallback } from 'react';

import { hypervisorId as matrixHypervisorId } from 'in-openstack/navigation/matrix';
import { instanceId as matrixInstanceId } from 'in-openstack/navigation/matrix';
import { regionId as matrixRegionId } from 'in-openstack/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
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

export function useOpenstackRegionDashboard() {
  return useDashboard(regionDashboardFullyQualified, regionDashboard, matrixRegionId);
}

export function useOpenstackHypervisorDashboard() {
  const paramsCallback = (params, regionId) => {
    setOrDeleteMatrixKey(params, hypervisorDashboard, matrixRegionId, regionId);
  };

  return useDashboard(hypervisorDashboardFullyQualified, hypervisorDashboard, matrixHypervisorId, paramsCallback);
}

export function useOpenstackInstanceDashboard() {
  const paramsCallback = (params, regionId) => {
    setOrDeleteMatrixKey(params, instanceDashboard, matrixRegionId, regionId);
  };

  return useDashboard(instanceDashboardFullyQualified, instanceDashboard, matrixInstanceId, paramsCallback);
}

function useDashboard(base, matrixSegment, matrixParam, paramsCallback) {
  const { location, createHref } = useNavigation();

  return useCallback(
    (id, { tab = '/summary', tabMatrix = {}, timeConfig, regionId } = emptyObject) => {
      const clonedLocation = cloneLocation(location);
      clonedLocation.pathname = `${base}${tab}`;

      setOrDeleteMatrixKey(clonedLocation, matrixSegment, matrixParam, id);

      if (timeConfig != null) {
        setTimeConfig(clonedLocation, timeConfig);
      }

      clonedLocation.matrix[tab] = tabMatrix;

      if (paramsCallback) {
        paramsCallback(clonedLocation, regionId);
      }

      return createHref(clonedLocation);
    },
    [base, matrixSegment, matrixParam, paramsCallback, location, createHref]
  );
}
