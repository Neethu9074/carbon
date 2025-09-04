/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const WindowsHypervisorMainView = () =>
  import(/* webpackChunkName: "windowshypervisor" */ 'in-windowshypervisor/WindowsHypervisorMainView');
const HostDashboard = () =>
  import(/* webpackChunkName: "windowshypervisor" */ 'in-windowshypervisor/Dashboards/Host/HostDashboard');
const VMDashboard = () =>
  import(/* webpackChunkName: "windowshypervisor" */ 'in-windowshypervisor/Dashboards/VM/VMDashboard');
import { Route } from 'react-router-dom';
import React from 'react';

import {
  windowsHypervisor,
  hostDashboardFullyQualified,
  vmDashboardFullyQualified
} from 'in-windowshypervisor/navigation/paths';
// @ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

export default [
  <Route key="hostDashboard" path={hostDashboardFullyQualified}>
    {renderAsyncRouteChildren(HostDashboard)}
  </Route>,
  <Route key="vmDashboard" path={vmDashboardFullyQualified}>
    {renderAsyncRouteChildren(VMDashboard)}
  </Route>,
  <Route key="windowshypervisorMainView" path={windowsHypervisor}>
    {renderAsyncRouteChildren(WindowsHypervisorMainView)}
  </Route>
];
