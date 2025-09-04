/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

const BusinessPerspectiveSummary = () =>
  import(/* webpackChunkName: "bizops" */ 'in-bizops/dashboards/perspectives/BusinessPerspectiveSummary');
const BusinessPerspectivesList = () =>
  import(/* webpackChunkName: "bizops" */ 'in-bizops/lists/businessPerspectives/BusinessPerspectivesList');
const BusinessActivitySummaryDashboard = () =>
  import(/* webpackChunkName: "bizops" */ 'in-bizops/dashboards/activity/BusinessActivitySummary');
const BusinessProcessSummaryDashboard = () =>
  import(/* webpackChunkName: "bizops" */ 'in-bizops/dashboards/summary/BusinessProcessSummary');
const BusinessProcessesList = () =>
  import(/* webpackChunkName: "bizops" */ 'in-bizops/lists/businessProcess/BusinessProcessList');
import { Route } from 'react-router-dom';
import React from 'react';

import {
  businessActivityDashboard,
  businessProcessDashboard,
  businessProcessPath,
  businessPerspectivesPath,
  businessPerspectiveDashboard
} from 'in-bizops/navigation/paths';
// @ts-expect-error module need to be translated to TS
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

let routes = [
  <Route key="BusinessProcessesList" exact path={businessProcessPath}>
    {renderAsyncRouteChildren(BusinessProcessesList)}
  </Route>,
  <Route key="BusinessActivityDashboard" path={businessActivityDashboard}>
    {renderAsyncRouteChildren(BusinessActivitySummaryDashboard)}
  </Route>,
  <Route key="businessProcessDashboard" path={businessProcessDashboard}>
    {renderAsyncRouteChildren(BusinessProcessSummaryDashboard)}
  </Route>,
  <Route key="BusinessPerspectivesList" exact path={businessPerspectivesPath}>
    {renderAsyncRouteChildren(BusinessPerspectivesList)}
  </Route>,
  <Route key="BusinessPerspectiveSummary" path={businessPerspectiveDashboard}>
    {renderAsyncRouteChildren(BusinessPerspectiveSummary)}
  </Route>
];

export default routes;
