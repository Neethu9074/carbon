/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { hostId as matrixHostId, vmId as matrixVmId } from 'in-xenserver/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { LocationMutator } from 'in-stores/navigation/navigation';

export const xenserver = '/xenserver';

export const poolList = '/pools';
export const poolDashboard = '/pool';
export const poolDashboardFullyQualified = `${xenserver}${poolDashboard}`;

export const hostList = '/hosts';
export const hostDashboard = '/host';
export const hostDashboardFullyQualified = `${xenserver}${hostDashboard}`;
export const xenserverHostListFullyQualified = `${xenserver}${hostList}`;

export const vmList = '/vms';
export const vmDashboard = '/vm';
export const vmDashboardFullyQualified = `${xenserver}${vmDashboard}`;

type NavigateToDashboardProps = {
  base: string;
  tab?: string;
  tabMatrix?: Record<string, string>;
  matrixSegment: string;
  matrixParam: string;
  paramsCallback?: LocationMutator;
};

export enum XenServerEntities {
  'host',
  'vm'
}

type LinkParams = {
  hostId?: string | null;
};

export const useXenServerEntityLink = (entityType: keyof typeof XenServerEntities, linkParams?: LinkParams) => {
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

  return useNewNavigateToDashboard(hookParams);
};

export const useNewNavigateToDashboard = ({
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
