/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const SystemDashboard = () => import(/* webpackChunkName: "zhmc" */ 'in-zhmc/Dashboards/Systems/SystemDashboard');
const ZhmcDashboard = () => import(/* webpackChunkName: "zhmc" */ 'in-zhmc/Dashboards/Zhmc/ZhmcDashboard');
const ZhmcMainView = () => import(/* webpackChunkName: "zhmc" */ 'in-zhmc/ZhmcMainView');
import { Route } from 'react-router-dom';
import React from 'react';

import { zhmcDashboardFullyQualified, cpcDashboardFullyQualified } from 'in-zhmc/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { ibmz } from 'in-zhmc/navigation/paths';

export default [
  <Route key="zhmcDashboard" path={zhmcDashboardFullyQualified} children={renderAsyncRouteChildren(ZhmcDashboard)} />,
  <Route
    key="zhmcSystemDashboard"
    path={cpcDashboardFullyQualified}
    children={renderAsyncRouteChildren(SystemDashboard)}
  />,
  <Route key="zhmcMainView" path={ibmz} children={renderAsyncRouteChildren(ZhmcMainView)} />
];
