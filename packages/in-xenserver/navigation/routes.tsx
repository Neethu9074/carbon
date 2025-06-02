/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error promis-loader cause failures when importing in typescript
import HostDashboard from 'promise-loader?global,xenserver!in-xenserver/Dashboards/Host/HostDashboard';
// @ts-expect-error promis-loader cause failures when importing in typescript
import VMDashboard from 'promise-loader?global,xenserver!in-xenserver/Dashboards/VM/VMDashboard';
// @ts-expect-error promis-loader cause failures when importing in typescript
import XenServerMainView from 'promise-loader?global,xenserver!in-xenserver/XenServerMainView';
import { Route } from 'react-router-dom';
import React from 'react';

import { xenserver, hostDashboardFullyQualified, vmDashboardFullyQualified } from 'in-xenserver/navigation/paths';
// @ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

export default [
  <Route key="hostDashboard" path={hostDashboardFullyQualified}>
    {renderAsyncRouteChildren(HostDashboard)}
  </Route>,
  <Route key="vmDashboard" path={vmDashboardFullyQualified}>
    {renderAsyncRouteChildren(VMDashboard)}
  </Route>,
  <Route key="xenserverMainView" path={xenserver}>
    {renderAsyncRouteChildren(XenServerMainView)}
  </Route>
];
