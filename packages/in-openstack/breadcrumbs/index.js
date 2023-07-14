/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import HypervisorBreadcrumb from 'in-openstack/breadcrumbs/HypervisorBreadcrumb';
import InstanceBreadcrumb from 'in-openstack/breadcrumbs/InstanceBreadcrumb';
import HomeViewBreadcrumb from 'in-openstack/breadcrumbs/HomeViewBreadcrumb';
import RegionBreadcrumb from 'in-openstack/breadcrumbs/RegionBreadcrumb';

export function RegionBreadcrumbs(props) {
  const { regionId } = props;
  return [<HomeViewBreadcrumb />, regionId && <RegionBreadcrumb {...props} />];
}

export function HypervisorBreadcrumbs(props) {
  const { hypervisorId, regionId } = props;

  return [
    <HomeViewBreadcrumb />,
    regionId && <RegionBreadcrumb {...props} />,
    hypervisorId && <HypervisorBreadcrumb {...props} />
  ];
}
export function InstanceBreadcrumbs(props) {
  const { instanceId, regionId } = props;
  return [
    <HomeViewBreadcrumb />,
    regionId && <RegionBreadcrumb {...props} />,
    instanceId && <InstanceBreadcrumb {...props} />
  ];
}
