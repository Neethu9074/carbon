/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { datacenterId as matrixDatacenterId } from 'in-vsphere/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { hostId as matrixHostId } from 'in-vsphere/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { LocationMutator } from 'in-stores/navigation/navigation';
import { vmId as matrixVmId } from 'in-vsphere/navigation/matrix';

export const vsphere = '/vsphere';

export const datacenterList = '/datacenters';
export const datacenterListFullyQualified = `${vsphere}${datacenterList}`;
export const datacenterDashboard = `/datacenter`;
export const datacenterDashboardFullyQualified = `${vsphere}${datacenterDashboard}`;
export const hostDashboard = `/host`;
export const hostDashboardFullyQualified = `${vsphere}${hostDashboard}`;
export const vmDashboard = `/vm`;
export const vmDashboardFullyQualified = `${vsphere}${vmDashboard}`;

type NavigateToDashboardProps = {
  base: string;
  tab?: string;
  tabMatrix?: Record<string, string>;
  matrixSegment: string;
  matrixParam: string;
  paramsCallback?: LocationMutator;
};

export enum VsphereEntities {
  'vm',
  'host',
  'datacenter'
}

type LinkParams = {
  datacenterId?: string;
  hostId?: string;
};

export const useVspehereEntityLink = (entityType: keyof typeof VsphereEntities, linkParams?: LinkParams) => {
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
