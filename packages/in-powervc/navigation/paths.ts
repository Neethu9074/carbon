/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { hypervisorId as matrixHypervisorId } from 'in-powervc/navigation/matrix';
import { instanceId as matrixInstanceId } from 'in-powervc/navigation/matrix';
import { regionId as matrixRegionId } from 'in-powervc/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { LocationMutator } from 'in-stores/navigation/navigation';

export const powervc = '/powervc';

export const powervcRegionList = '/regions';
export const powervcRegionListFullyQualified = `${powervc}${powervcRegionList}`;
export const powervcRegionDashboard = `/region`;
export const powervcRegionDashboardFullyQualified = `${powervc}${powervcRegionDashboard}`;
export const powervcHypervisorDashboard = `/hypervisor`;
export const powervcHypervisorDashboardFullyQualified = `${powervc}${powervcHypervisorDashboard}`;
export const powervcInstanceDashboard = `/instance`;
export const powervcInstanceDashboardFullyQualified = `${powervc}${powervcInstanceDashboard}`;

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
export function usePowervcInstanceDashboard(regionId?: string) {
  return useNavigateToDashboard({
    base: powervcInstanceDashboardFullyQualified,
    matrixSegment: powervcInstanceDashboard,
    matrixParam: matrixInstanceId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, powervcInstanceDashboard, matrixRegionId, regionId);
    }
  });
}

function useNavigateToDashboard({ base, matrixSegment, matrixParam, paramsCallback }: NavigateToDashboardProps) {
  const { location, createHref } = useNavigation();
  const targetLocation = { ...location, pathname: `${base}/summary` };
  return (id: string) => {
    setOrDeleteMatrixKey(targetLocation, matrixSegment, matrixParam, id);
    if (paramsCallback) {
      paramsCallback(targetLocation);
    }
    return createHref(targetLocation);
  };
}
