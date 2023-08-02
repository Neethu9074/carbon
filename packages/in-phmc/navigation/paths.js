/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useCallback } from 'react';

import { sharedProcessorPoolId as matrixSharedProcessorPoolId } from 'in-phmc/navigation/matrix';
import { consoleId as matrixConsoleId } from 'in-phmc/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { systemId as matrixSystemId } from 'in-phmc/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { viosId as matrixViosId } from 'in-phmc/navigation/matrix';
import { lparId as matrixLparId } from 'in-phmc/navigation/matrix';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';

export const ibmp = '/ibmp';

export const phmcList = '/phmcs';
export const phmcListFullyQualified = `${ibmp}${phmcList}`;
export const phmcDashboard = `/phmc`;
export const phmcDashboardFullyQualified = `${ibmp}${phmcDashboard}`;
export const systemList = '/systems';
export const systemListFullyQualified = `${ibmp}${systemList}`;
export const systemDashboard = `/system`;
export const systemDashboardFullyQualified = `${ibmp}${systemDashboard}`;
export const viosDashboard = `/vios`;
export const viosDashboardFullyQualified = `${ibmp}${viosDashboard}`;
export const lparDashboard = `/lpar`;
export const lparDashboardFullyQualified = `${ibmp}${lparDashboard}`;
export const sppDashboard = `/sharedProcessorPool`;
export const sppDashboardFullyQualified = `${ibmp}${sppDashboard}`;

export function useIbmpPhmcDashboard() {
  return useDashboard(phmcDashboardFullyQualified, phmcDashboard, matrixConsoleId);
}

export function useIbmpSystemDashboard() {
  const paramsCallback = (params, consoleId) => {
    setOrDeleteMatrixKey(params, systemDashboard, matrixConsoleId, consoleId);
  };

  return useDashboard(systemDashboardFullyQualified, systemDashboard, matrixSystemId, paramsCallback);
}

export function useIbmpViosDashboard() {
  const paramsCallback = (params, consoleId, systemId) => {
    setOrDeleteMatrixKey(params, viosDashboard, matrixConsoleId, consoleId);
    setOrDeleteMatrixKey(params, viosDashboard, matrixSystemId, systemId);
  };

  return useDashboard(viosDashboardFullyQualified, viosDashboard, matrixViosId, paramsCallback);
}

export function useIbmpLparDashboard() {
  const paramsCallback = (params, consoleId, systemId) => {
    setOrDeleteMatrixKey(params, lparDashboard, matrixConsoleId, consoleId);
    setOrDeleteMatrixKey(params, lparDashboard, matrixSystemId, systemId);
  };

  return useDashboard(lparDashboardFullyQualified, lparDashboard, matrixLparId, paramsCallback);
}

export function useIbmpSppDashboard() {
  const paramsCallback = (params, consoleId, systemId) => {
    setOrDeleteMatrixKey(params, sppDashboard, matrixConsoleId, consoleId);
    setOrDeleteMatrixKey(params, sppDashboard, matrixSystemId, systemId);
  };

  return useDashboard(sppDashboardFullyQualified, sppDashboard, matrixSharedProcessorPoolId, paramsCallback);
}

function useDashboard(base, matrixSegment, matrixParam, paramsCallback) {
  const { location, createHref } = useNavigation();

  return useCallback(
    (id, { tab = '/summary', tabMatrix = {}, timeConfig, consoleId, systemId } = emptyObject) => {
      const clonedLocation = cloneLocation(location);
      clonedLocation.pathname = `${base}${tab}`;

      setOrDeleteMatrixKey(clonedLocation, matrixSegment, matrixParam, id);

      if (timeConfig != null) {
        setTimeConfig(clonedLocation, timeConfig);
      }

      clonedLocation.matrix[tab] = tabMatrix;

      if (paramsCallback) {
        paramsCallback(clonedLocation, consoleId, systemId);
      }

      return createHref(clonedLocation);
    },
    [base, matrixSegment, matrixParam, paramsCallback, location, createHref]
  );
}
