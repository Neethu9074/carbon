import React from 'react';

import DatacenterBreadcrumb from 'in-vsphere/breadcrumbs/DatacenterBreadcrumb';
import HomeViewBreadcrumb from 'in-vsphere/breadcrumbs/HomeViewBreadcrumb';
import HostBreadcrumb from 'in-vsphere/breadcrumbs/HostBreadcrumb';
import VmBreadcrumb from 'in-vsphere/breadcrumbs/VmBreadcrumb';

export function DatacenterBreadcrumbs(props) {
  const { datacenterId, hostId, vmId } = props;
  return [
    <HomeViewBreadcrumb />,
    datacenterId && <DatacenterBreadcrumb {...props} />,
    hostId && <HostBreadcrumb {...props} />,
    vmId && <VmBreadcrumb {...props} />
  ];
}
