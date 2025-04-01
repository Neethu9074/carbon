/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error promis-loader cause failures when importing in typescript
import HostDashboard from 'promise-loader?global,xenserver!in-xenserver/Dashboards/Host/HostDashboard';
// @ts-expect-error promis-loader cause failures when importing in typescript
import XenServerMainView from 'promise-loader?global,xenserver!in-xenserver/XenServerMainView';
import { Route } from 'react-router-dom';
import React from 'react';

// @ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { xenserver, hostDashboardFullyQualified } from 'in-xenserver/navigation/paths';

export default [
  <Route key="hostDashboard" path={hostDashboardFullyQualified}>
    {renderAsyncRouteChildren(HostDashboard)}
  </Route>,
  <Route key="xenserverMainView" path={xenserver}>
    {renderAsyncRouteChildren(XenServerMainView)}
  </Route>
];
