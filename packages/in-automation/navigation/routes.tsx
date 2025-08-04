/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

const ActionHistory = () =>
  import(/* webpackChunkName: "global" */ 'in-automation/components/ActionHistory/ActionHistory');
const ActionCatalogTab = () => import(/* webpackChunkName: "global" */ 'in-automation/ActionCatalog/ActionCatalogTab');
const ActionDashboard = () => import(/* webpackChunkName: "global" */ 'in-automation/ActionDashboard/ActionDashboard');
const PolicyDetail = () => import(/* webpackChunkName: "global" */ 'in-automation/PolicyDetails/PolicyDetails');
const Policies = () => import(/* webpackChunkName: "global" */ 'in-automation/Policies/Policies');
import { Route } from 'react-router';
import React from 'react';

import {
  actionCatalogFullyQualified,
  actionDashboardFullyQualified,
  actionHistoryPath,
  policiesFullyQualified,
  policyDetailsFullyQualified
} from 'in-automation/navigation/paths';
// @ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

export default [
  <Route exact path={actionHistoryPath} key="InstanaActionHistory">
    {renderAsyncRouteChildren(ActionHistory)}
  </Route>,
  <Route exact path={actionCatalogFullyQualified} key="actionCatalog">
    {renderAsyncRouteChildren(ActionCatalogTab)}
  </Route>,
  <Route path={actionDashboardFullyQualified} key="actionDashboard">
    {renderAsyncRouteChildren(ActionDashboard)}
  </Route>,
  <Route exact path={policiesFullyQualified} key="policies">
    {renderAsyncRouteChildren(Policies)}
  </Route>,
  <Route path={policyDetailsFullyQualified} key="policyDashboard">
    {renderAsyncRouteChildren(PolicyDetail)}
  </Route>
];
