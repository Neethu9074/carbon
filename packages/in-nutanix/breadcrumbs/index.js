/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import DatacenterBreadcrumb from 'in-nutanix/breadcrumbs/DatacenterBreadcrumb';
import HomeViewBreadcrumb from 'in-nutanix/breadcrumbs/HomeViewBreadcrumb';
import { useNutanixEntityLink } from 'in-nutanix/navigation/paths';
import HostBreadcrumb from 'in-nutanix/breadcrumbs/HostBreadcrumb';
import VmBreadcrumb from 'in-nutanix/breadcrumbs/VmBreadcrumb';

export function DatacenterBreadcrumbs(props) {
  const { datacenterId } = props;
  return [<HomeViewBreadcrumb />, datacenterId && <DatacenterBreadcrumb {...props} />];
}

export function HostBreadcrumbs(props) {
  const { hostId, datacenterId } = props;

  const getNutanixDatacenterDashboard = useNutanixEntityLink('datacenter');

  return [
    <HomeViewBreadcrumb />,
    datacenterId && <DatacenterBreadcrumb {...props} href={getNutanixDatacenterDashboard(datacenterId)} />,
    hostId && <HostBreadcrumb {...props} />
  ];
}

export function VmBreadcrumbs(props) {
  const { vmId, hostId, datacenterId } = props;

  return [
    <HomeViewBreadcrumb />,
    datacenterId && <DatacenterBreadcrumb {...props} />,
    hostId && <HostBreadcrumb {...props} />,
    vmId && <VmBreadcrumb {...props} />
  ];
}
