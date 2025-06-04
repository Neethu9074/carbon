/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

import { hostId as matrixHostId, vmId as matrixVmId } from 'in-windowshypervisor/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { LocationMutator } from 'in-stores/navigation/navigation';

export const windowsHypervisor = '/windowshypervisor';

export const hostList = '/hosts';
export const hostDashboard = '/host';
export const hostDashboardFullyQualified = `${windowsHypervisor}${hostDashboard}`;
export const windowsHypervisorHostListFullyQualified = `${windowsHypervisor}${hostList}`;

export const vmList = '/vms';
export const vmDashboard = '/vm';
export const vmDashboardFullyQualified = `${windowsHypervisor}${vmDashboard}`;

type NavigateToDashboardProps = {
  base: string;
  tab?: string;
  tabMatrix?: Record<string, string>;
  matrixSegment: string;
  matrixParam: string;
  paramsCallback?: LocationMutator;
};

export enum WindowsHypervisorEntities {
  'host',
  'vm'
}

type LinkParams = {
  hostId?: string;
  vmId?: string | null;
};

export const useWindowsHypervisorEntityLink = (
  entityType: keyof typeof WindowsHypervisorEntities,
  linkParams?: LinkParams
) => {
  let hookParams: NavigateToDashboardProps;

  switch (entityType) {
    case 'vm':
      hookParams = {
        base: vmDashboardFullyQualified,
        matrixSegment: vmDashboard,
        matrixParam: matrixVmId,
        paramsCallback: (params: any) => {
          setOrDeleteMatrixKey(params, vmDashboard, matrixHostId, linkParams?.hostId);
        }
      };
      break;
    case 'host':
      hookParams = {
        base: hostDashboardFullyQualified,
        matrixSegment: hostDashboard,
        matrixParam: matrixHostId
      };
      break;
  }

  return useNavigateToSummaryDashboard(hookParams);
};

export const useNavigateToSummaryDashboard = ({
  base,
  matrixSegment,
  matrixParam,
  paramsCallback
}: NavigateToDashboardProps) => {
  const { location, createHref } = useNavigation();
  const navigateToDashboardLocation = { ...location, pathname: `${base}/summary` };

  return (id: string) => {
    setOrDeleteMatrixKey(navigateToDashboardLocation, matrixSegment, matrixParam, id);
    if (paramsCallback) {
      paramsCallback(navigateToDashboardLocation);
    }
    return createHref(navigateToDashboardLocation);
  };
};
