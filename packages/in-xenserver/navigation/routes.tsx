/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const HostDashboard = () => import(/* webpackChunkName: "xenserver" */ 'in-xenserver/Dashboards/Host/HostDashboard');
const VMDashboard = () => import(/* webpackChunkName: "xenserver" */ 'in-xenserver/Dashboards/VM/VMDashboard');
const XenServerMainView = () => import(/* webpackChunkName: "xenserver" */ 'in-xenserver/XenServerMainView');
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
