/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import ActionHistory from 'promise-loader?global!in-automation/components/ActionHistory/ActionHistory';
// @ts-expect-error
import ActionCatalog from 'promise-loader?global!in-automation/ActionCatalog/ActionCatalog';
// @ts-expect-error
import ActionDetailsPage from 'promise-loader?global!in-automation/ActionCatalog/Action';
// @ts-expect-error
import PolicyDetails from 'promise-loader?global!in-automation/Policies/Policy';
// @ts-expect-error
import Policies from 'promise-loader?global!in-automation/Policies/Policies';
import { Route } from 'react-router';
import React from 'react';

import {
  actionCatalogFullyQualified,
  actionDetailsFullyQualified,
  actionHistoryPath,
  policiesFullyQualified,
  policiesDetailsFullyQualified
} from 'in-automation/navigation/paths';
// @ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

export default [
  <Route exact path={actionHistoryPath} key="InstanaActionHistory">
    {renderAsyncRouteChildren(ActionHistory)}
  </Route>,
  <Route exact path={actionCatalogFullyQualified} key="actionCatalog">
    {renderAsyncRouteChildren(ActionCatalog)}
  </Route>,
  <Route exact path={actionDetailsFullyQualified} key="actionDetails">
    {renderAsyncRouteChildren(ActionDetailsPage)}
  </Route>,
  <Route exact path={policiesFullyQualified} key="policies">
    {renderAsyncRouteChildren(Policies)}
  </Route>,
  <Route path={policiesDetailsFullyQualified} key="policyDetails">
    {renderAsyncRouteChildren(PolicyDetails)}
  </Route>
];
