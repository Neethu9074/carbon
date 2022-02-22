/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// import { getOpenstackRegionDashboard } from 'in-openstack/navigation/paths';
import RegionBreadcrumb from 'in-openstack/breadcrumbs/RegionBreadcrumb';
import HomeViewBreadcrumb from 'in-openstack/breadcrumbs/HomeViewBreadcrumb';

// import HostBreadcrumb from 'in-vsphere/breadcrumbs/HostBreadcrumb';
// import VmBreadcrumb from 'in-vsphere/breadcrumbs/VmBreadcrumb';

export function RegionBreadcrumbs(props) {
  const { regionId } = props;
  return [<HomeViewBreadcrumb />, regionId && <RegionBreadcrumb {...props} />];
}

// export function HostBreadcrumbs(props) {
//   const { hostId, datacenterId } = props;

//   return [
//     <HomeViewBreadcrumb />,
//     datacenterId && <DatacenterBreadcrumb {...props} href$={getVsphereDatacenterDashboard(datacenterId)} />,
//     hostId && <HostBreadcrumb {...props} />
//   ];
// }

// export function VmBreadcrumbs(props) {
//   const { vmId, hostId, datacenterId } = props;
//   return [
//     <HomeViewBreadcrumb />,
//     datacenterId && <DatacenterBreadcrumb {...props} href$={getVsphereDatacenterDashboard(datacenterId)} />,
//     hostId && <HostBreadcrumb {...props} href$={getVsphereHostDashboard(hostId, { datacenterId })} />,
//     vmId && <VmBreadcrumb {...props} />
//   ];
// }
