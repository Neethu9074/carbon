/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getVsphereDatacenterDashboard, getVsphereHostDashboard } from 'in-vsphere/navigation/paths';
import DatacenterBreadcrumb from 'in-vsphere/breadcrumbs/DatacenterBreadcrumb';
import HomeViewBreadcrumb from 'in-vsphere/breadcrumbs/HomeViewBreadcrumb';
import HostBreadcrumb from 'in-vsphere/breadcrumbs/HostBreadcrumb';
import VmBreadcrumb from 'in-vsphere/breadcrumbs/VmBreadcrumb';

export function DatacenterBreadcrumbs(props) {
  const { datacenterId } = props;
  return [<HomeViewBreadcrumb />, datacenterId && <DatacenterBreadcrumb {...props} />];
}

export function HostBreadcrumbs(props) {
  const { hostId, datacenterId } = props;

  return [
    <HomeViewBreadcrumb />,
    datacenterId && <DatacenterBreadcrumb {...props} href$={getVsphereDatacenterDashboard(datacenterId)} />,
    hostId && <HostBreadcrumb {...props} />
  ];
}

export function VmBreadcrumbs(props) {
  const { vmId, hostId, datacenterId } = props;
  return [
    <HomeViewBreadcrumb />,
    datacenterId && <DatacenterBreadcrumb {...props} href$={getVsphereDatacenterDashboard(datacenterId)} />,
    hostId && <HostBreadcrumb {...props} href$={getVsphereHostDashboard(hostId, { datacenterId })} />,
    vmId && <VmBreadcrumb {...props} />
  ];
}
