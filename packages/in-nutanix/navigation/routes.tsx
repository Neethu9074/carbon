/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error promis-loader cause failures when importing in typescript
import DatacenterDashboard from 'promise-loader?global,nutanix!in-nutanix/Dashboards/Datacenter/DatacenterDashboard';
// @ts-expect-error promis-loader cause failures when importing in typescript
import HostDashboard from 'promise-loader?global,nutanix!in-nutanix/Dashboards/Host/HostDashboard';
// @ts-expect-error promis-loader cause failures when importing in typescript
import VmDashboard from 'promise-loader?global,nutanix!in-nutanix/Dashboards/Vm/VmDashboard';
// @ts-expect-error promis-loader cause failures when importing in typescript
import NutanixMainView from 'promise-loader?global,nutanix!in-nutanix/NutanixMainView';
import { Route } from 'react-router-dom';
import React from 'react';

import {
  nutanix,
  datacenterDashboardFullyQualified,
  hostDashboardFullyQualified,
  vmDashboardFullyQualified
} from 'in-nutanix/navigation/paths';
// @ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

export default [
  <Route key="datacenterDashboard" path={datacenterDashboardFullyQualified}>
    {renderAsyncRouteChildren(DatacenterDashboard)}
  </Route>,
  <Route key="HostDashboard" path={hostDashboardFullyQualified}>
    {renderAsyncRouteChildren(HostDashboard)}
  </Route>,
  <Route key="VmDashboard" path={vmDashboardFullyQualified}>
    {renderAsyncRouteChildren(VmDashboard)}
  </Route>,
  <Route key="nutanixMainView" path={nutanix}>
    {renderAsyncRouteChildren(NutanixMainView)}
  </Route>
];
