/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error promis-loader cause failures when importing in typescript
import WindowsHypervisorMainView from 'promise-loader?global,windowshypervisor!in-windowshypervisor/WindowsHypervisorMainView';
// @ts-expect-error promis-loader cause failures when importing in typescript
import HostDashboard from 'promise-loader?global,windowshypervisor!in-windowshypervisor/Dashboards/Host/HostDashboard';
// @ts-expect-error promis-loader cause failures when importing in typescript
import VMDashboard from 'promise-loader?global,windowshypervisor!in-windowshypervisor/Dashboards/VM/VMDashboard';
import { Route } from 'react-router-dom';
import React from 'react';

// @ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { windowsHypervisor, hostDashboardFullyQualified } from 'in-windowshypervisor/navigation/paths';
import { vmDashboardFullyQualified } from 'in-windowshypervisor/navigation/paths';

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
