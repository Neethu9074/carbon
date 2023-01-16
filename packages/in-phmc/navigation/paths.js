/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { sharedProcessorPoolId as matrixSharedProcessorPoolId } from 'in-phmc/navigation/matrix';
import { consoleId as matrixConsoleId } from 'in-phmc/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { systemId as matrixSystemId } from 'in-phmc/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { viosId as matrixViosId } from 'in-phmc/navigation/matrix';
import { lparId as matrixLparId } from 'in-phmc/navigation/matrix';
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

export function getIbmpPhmcDashboard(consoleId, { tab, tabMatrix, timeConfig } = emptyObject) {
  return getDashboard({
    base: phmcDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: phmcDashboard,
    matrixParam: matrixConsoleId,
    id: consoleId
  });
}

export function getIbmpSystemDashboard(systemId, { tab, tabMatrix, timeConfig, consoleId } = emptyObject) {
  return getDashboard({
    base: systemDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: systemDashboard,
    matrixParam: matrixSystemId,
    id: systemId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, systemDashboard, matrixConsoleId, consoleId);
    }
  });
}

export function getIbmpViosDashboard(viosId, { tab, tabMatrix, timeConfig, consoleId, systemId } = emptyObject) {
  return getDashboard({
    base: viosDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: viosDashboard,
    matrixParam: matrixViosId,
    id: viosId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, viosDashboard, matrixConsoleId, consoleId);
      setOrDeleteMatrixKey(params, viosDashboard, matrixSystemId, systemId);
    }
  });
}

export function getIbmpLparDashboard(lparId, { tab, tabMatrix, timeConfig, consoleId, systemId } = emptyObject) {
  return getDashboard({
    base: lparDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: lparDashboard,
    matrixParam: matrixLparId,
    id: lparId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, lparDashboard, matrixConsoleId, consoleId);
      setOrDeleteMatrixKey(params, lparDashboard, matrixSystemId, systemId);
    }
  });
}
export function getIbmpSppDashboard(
  sharedProcessorPoolId,
  { tab, tabMatrix, timeConfig, consoleId, systemId } = emptyObject
) {
  return getDashboard({
    base: sppDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: sppDashboard,
    matrixParam: matrixSharedProcessorPoolId,
    id: sharedProcessorPoolId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, sppDashboard, matrixConsoleId, consoleId);
      setOrDeleteMatrixKey(params, sppDashboard, matrixSystemId, systemId);
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
