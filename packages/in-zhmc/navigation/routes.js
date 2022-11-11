/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import SystemDashboard from 'promise-loader?global,zhmc!in-zhmc/Dashboards/Systems/SystemDashboard';
import ZhmcDashboard from 'promise-loader?global,zhmc!in-zhmc/Dashboards/Zhmc/ZhmcDashboard';
import ZhmcMainView from 'promise-loader?global,zhmc!in-zhmc/ZhmcMainView';
import { Route } from 'react-router-dom';
import React from 'react';

import { zhmcDashboardFullyQualified, cpcDashboardFullyQualified } from 'in-zhmc/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { ibmz } from 'in-zhmc/navigation/paths';

export default [
  <Route path={zhmcDashboardFullyQualified} children={renderAsyncRouteChildren(ZhmcDashboard)} />,
  <Route path={cpcDashboardFullyQualified} children={renderAsyncRouteChildren(SystemDashboard)} />,
  <Route path={ibmz} children={renderAsyncRouteChildren(ZhmcMainView)} />
];
