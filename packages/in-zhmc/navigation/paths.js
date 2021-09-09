/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { consoleId as matrixconsoleId } from 'in-zhmc/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { cpcId as matrixCpcId } from 'in-zhmc/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';

export const ibmz = '/ibmz';

export const zhmcList = '/zhmcs';
export const zhmcListFullyQualified = `${ibmz}${zhmcList}`;
export const zhmcDashboard = `/zhmc`;
export const zhmcDashboardFullyQualified = `${ibmz}${zhmcDashboard}`;
export const cpcList = '/systems';
export const cpcListFullyQualified = `${ibmz}${cpcList}`;
export const cpcDashboard = `/system`;
export const cpcDashboardFullyQualified = `${ibmz}${cpcDashboard}`;

export function getIbmzZhmcDashboard(consoleId, { tab, tabMatrix, timeConfig } = emptyObject) {
  return getDashboard({
    base: zhmcDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: zhmcDashboard,
    matrixParam: matrixconsoleId,
    id: consoleId
  });
}

export function getIbmzCpcDashboard(cpcId, { tab, tabMatrix, timeConfig, consoleId } = emptyObject) {
  return getDashboard({
    base: cpcDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: cpcDashboard,
    matrixParam: matrixCpcId,
    id: cpcId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, cpcDashboard, matrixconsoleId, consoleId);
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
