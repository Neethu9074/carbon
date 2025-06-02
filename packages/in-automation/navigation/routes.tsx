/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import ActionHistory from 'promise-loader?global!in-automation/components/ActionHistory/ActionHistory';
// @ts-expect-error
import ActionCatalogTab from 'promise-loader?global!in-automation/ActionCatalog/ActionCatalogTab';
// @ts-expect-error
import ActionDashboard from 'promise-loader?global!in-automation/ActionDashboard/ActionDashboard';
// @ts-expect-error
import PolicyDetail from 'promise-loader?global!in-automation/PolicyDetails/PolicyDetails';
// @ts-expect-error
import PolicyDetails from 'promise-loader?global!in-automation/Policies/Policy';
// @ts-expect-error
import Policies from 'promise-loader?global!in-automation/Policies/Policies';
import { Route } from 'react-router';
import React from 'react';

import {
  actionCatalogFullyQualified,
  actionDashboardFullyQualified,
  actionHistoryPath,
  policiesFullyQualified,
  policiesDetailsFullyQualified,
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
  <Route path={policiesDetailsFullyQualified} key="policyDetails">
    {renderAsyncRouteChildren(PolicyDetails)}
  </Route>,
  <Route path={policyDetailsFullyQualified} key="policyDashboard">
    {renderAsyncRouteChildren(PolicyDetail)}
  </Route>
];
