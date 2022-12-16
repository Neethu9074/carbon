/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getModifiedUrlStream, LocationMutator } from 'in-stores/navigation/navigation';
import { consoleId as matrixconsoleId } from 'in-zhmc/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { cpcId as matrixCpcId } from 'in-zhmc/navigation/matrix';

export const ibmz = '/ibmz';

export const zhmcList = '/zhmcs';
export const zhmcListFullyQualified = `${ibmz}${zhmcList}`;
export const zhmcDashboard = `/zhmc`;
export const zhmcDashboardFullyQualified = `${ibmz}${zhmcDashboard}`;
export const cpcList = '/systems';
export const cpcListFullyQualified = `${ibmz}${cpcList}`;
export const cpcDashboard = `/system`;
export const cpcDashboardFullyQualified = `${ibmz}${cpcDashboard}`;

type NavigateToDashboardProps = {
  base: string;
  tab?: string;
  tabMatrix?: Record<string, string>;
  matrixSegment: string;
  matrixParam: string;
  paramsCallback?: LocationMutator;
};

export function useIbmzZhmcDashboard() {
  return useNavigateToDashboard({
    base: zhmcDashboardFullyQualified,
    matrixSegment: zhmcDashboard,
    matrixParam: matrixconsoleId
  });
}

export function useIbmzCpcDashboard(consoleId?: string) {
  return useNavigateToDashboard({
    base: cpcDashboardFullyQualified,
    matrixSegment: cpcDashboard,
    matrixParam: matrixCpcId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, cpcDashboard, matrixconsoleId, consoleId);
    }
  });
}

function useNavigateToDashboard({ base, matrixSegment, matrixParam, paramsCallback }: NavigateToDashboardProps) {
  return (id: string) =>
    getModifiedUrlStream(params => {
      params.pathname = `${base}/summary`;
      setOrDeleteMatrixKey(params, matrixSegment, matrixParam, id);
      if (paramsCallback) {
        paramsCallback(params);
      }
    });
}
