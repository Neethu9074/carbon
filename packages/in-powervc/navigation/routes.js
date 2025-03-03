/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import ComputeInstancesDashboard from 'promise-loader?global,powervc!in-powervc/Dashboards/ComputeInstances/ComputeInstancesDashboard';
import HypervisorDashboard from 'promise-loader?global,powervc!in-powervc/Dashboards/Hypervisors/HypervisorDashboard';

import RegionDashboard from 'promise-loader?global,powervc!in-powervc/Dashboards/Regions/RegionDashboard';
import PowervcMainView from 'promise-loader?global,powervc!in-powervc/PowervcMainView';
import { Route } from 'react-router-dom';
import React from 'react';

import {
  powervc,
  powervcRegionDashboardFullyQualified,
  powervcHypervisorDashboardFullyQualified,
  powervcInstanceDashboardFullyQualified
} from 'in-powervc/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

export default [
  <Route
    key="powervcRegionDashboard"
    path={powervcRegionDashboardFullyQualified}
    children={renderAsyncRouteChildren(RegionDashboard)}
  />,
  <Route
    key="powervcHypervisorDashboard"
    path={powervcHypervisorDashboardFullyQualified}
    children={renderAsyncRouteChildren(HypervisorDashboard)}
  />,
  <Route
    key="powervcInstanceDashboard"
    path={powervcInstanceDashboardFullyQualified}
    children={renderAsyncRouteChildren(ComputeInstancesDashboard)}
  />,
  <Route key="powervcMainView" path={powervc} children={renderAsyncRouteChildren(PowervcMainView)} />
];
