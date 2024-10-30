/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { datacenterId as matrixDatacenterId } from 'in-nutanix/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { hostId as matrixHostId } from 'in-nutanix/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { LocationMutator } from 'in-stores/navigation/navigation';
import { vmId as matrixVmId } from 'in-nutanix/navigation/matrix';

export const nutanix = '/nutanix';

export const nutanixClusterList = '/datacenters';
export const nutanixClusterListFullyQualified = `${nutanix}${nutanixClusterList}`;
export const datacenterDashboard = `/datacenter`;
export const datacenterDashboardFullyQualified = `${nutanix}${datacenterDashboard}`;
export const hostDashboard = `/host`;
export const hostDashboardFullyQualified = `${nutanix}${hostDashboard}`;
export const vmDashboard = `/vm`;
export const vmDashboardFullyQualified = `${nutanix}${vmDashboard}`;

type NavigateToDashboardProps = {
  base: string;
  tab?: string;
  tabMatrix?: Record<string, string>;
  matrixSegment: string;
  matrixParam: string;
  paramsCallback?: LocationMutator;
};

export enum NutanixEntities {
  'vm',
  'host',
  'datacenter'
}

type LinkParams = {
  datacenterId?: string;
  hostId?: string;
};

export const useNutanixEntityLink = (entityType: keyof typeof NutanixEntities, linkParams?: LinkParams) => {
  let hookParams: NavigateToDashboardProps;

  switch (entityType) {
    case 'vm':
      hookParams = {
        base: vmDashboardFullyQualified,
        matrixSegment: vmDashboard,
        matrixParam: matrixVmId,
        paramsCallback: (params: any) => {
          setOrDeleteMatrixKey(params, vmDashboard, matrixDatacenterId, linkParams?.datacenterId);
          setOrDeleteMatrixKey(params, vmDashboard, matrixHostId, linkParams?.hostId);
        }
      };
      break;
    case 'datacenter':
      hookParams = {
        base: datacenterDashboardFullyQualified,
        matrixSegment: datacenterDashboard,
        matrixParam: matrixDatacenterId
      };
      break;
    case 'host':
      hookParams = {
        base: hostDashboardFullyQualified,
        matrixSegment: hostDashboard,
        matrixParam: matrixHostId,
        paramsCallback: (params: any) => {
          setOrDeleteMatrixKey(params, hostDashboard, matrixDatacenterId, linkParams?.datacenterId);
        }
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
  const navigatoToDashboardLocation = { ...location, pathname: `${base}/summary` };

  return (id: string) => {
    setOrDeleteMatrixKey(navigatoToDashboardLocation, matrixSegment, matrixParam, id);
    if (paramsCallback) {
      paramsCallback(navigatoToDashboardLocation);
    }

    return createHref(navigatoToDashboardLocation);
  };
};
