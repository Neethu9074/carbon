/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getModifiedUrlStream, LocationMutator } from 'in-stores/navigation/navigation';
import { hypervisorId as matrixHypervisorId } from 'in-powervc/navigation/matrix';
import { regionId as matrixRegionId } from 'in-powervc/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const powervc = '/powervc';

export const powervcRegionList = '/regions';
export const powervcRegionListFullyQualified = `${powervc}${powervcRegionList}`;
export const powervcRegionDashboard = `/region`;
export const powervcRegionDashboardFullyQualified = `${powervc}${powervcRegionDashboard}`;
export const powervcHypervisorDashboard = `/hypervisor`;
export const powervcHypervisorDashboardFullyQualified = `${powervc}${powervcHypervisorDashboard}`;


type NavigateToDashboardProps = {
  base: string;
  tab?: string;
  tabMatrix?: Record<string, string>;
  matrixSegment: string;
  matrixParam: string;
  paramsCallback?: LocationMutator;
};

export function usePowervcRegionDashboard() {
  return useNavigateToDashboard({
    base: powervcRegionDashboardFullyQualified,
    matrixSegment: powervcRegionDashboard,
    matrixParam: matrixRegionId
  });
}
export function usePowervcHypervisorDashboard(regionId?: string) {
  return useNavigateToDashboard({
    base: powervcHypervisorDashboardFullyQualified,
    matrixSegment: powervcHypervisorDashboard,
    matrixParam: matrixHypervisorId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, powervcHypervisorDashboard, matrixRegionId, regionId);
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
