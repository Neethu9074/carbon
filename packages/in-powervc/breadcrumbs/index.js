/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import HypervisorBreadcrumb from 'in-powervc/breadcrumbs/HypervisorBreadcrumb';
import { usePowervcHypervisorDashboard } from 'in-powervc/navigation/paths';
import HomeViewBreadcrumb from 'in-powervc/breadcrumbs/HomeViewBreadcrumb';
import RegionBreadcrumb from 'in-powervc/breadcrumbs/RegionBreadcrumb';

export function RegionBreadcrumbs(props) {
  const { regionId } = props;
  return [<HomeViewBreadcrumb />,regionId && <RegionBreadcrumb {...props} />];
}

export function HypervisorBreadcrumbs(props) {
  const { hypervisorId, regionId } = props;
  const getPowervcHypervisorDashboard = usePowervcHypervisorDashboard();

  return [
    <HomeViewBreadcrumb />,
    regionId && <RegionBreadcrumb {...props} href$={getPowervcHypervisorDashboard(regionId)} />,
    hypervisorId && <HypervisorBreadcrumb {...props} />
  ];
}
