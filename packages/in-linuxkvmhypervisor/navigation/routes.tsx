/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error promis-loader cause failures when importing in typescript
import LinuxKVMHypervisorMainView from 'promise-loader?global,linuxkvmhypervisor!in-linuxkvmhypervisor/LinuxKVMHypervisorMainView';
// @ts-expect-error promis-loader cause failures when importing in typescript
import HostDashboard from 'promise-loader?global,linuxkvmhypervisor!in-linuxkvmhypervisor/Dashboards/Host/HostDashboard';
import { Route } from 'react-router-dom';
import React from 'react';

// @ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { linuxkvmhypervisor, hostDashboardFullyQualified } from 'in-linuxkvmhypervisor/navigation/paths';

export default [
  <Route key="hostDashboard" path={hostDashboardFullyQualified}>
    {renderAsyncRouteChildren(HostDashboard)}
  </Route>,
  <Route key="linuxkvmhypervisorMainView" path={linuxkvmhypervisor}>
    {renderAsyncRouteChildren(LinuxKVMHypervisorMainView)}
  </Route>
];
