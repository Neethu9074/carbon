/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import ActionHistory from 'promise-loader?global!in-automation/components/ActionHistory/ActionHistory';
// @ts-expect-error
import ActionCatalogTab from 'promise-loader?global!in-automation/ActionCatalog/ActionCatalog';
// @ts-expect-error
import PolicyDashboard from 'promise-loader?global!in-automation/Policies/PolicyDashboard';
// @ts-expect-error
import ActionDetailsPage from 'promise-loader?global!in-automation/ActionCatalog/Action';
// @ts-expect-error
import PolicyDetails from 'promise-loader?global!in-automation/Policies/Policy';
// @ts-expect-error
import Policies from 'promise-loader?global!in-automation/Policies/Policies';
import { Route } from 'react-router';
import React from 'react';

import {
  actionCatalogPath,
  actionDetailsPath,
  actionDetailsCopyFormPath,
  actionHistoryPath,
  policiesFullyQualified,
  policiesDetailsFullyQualified,
  policiesOverviewFullyQualified
} from 'in-automation/navigation/paths';
// @ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

const addKeyToComponent = (component: React.ReactElement, key = '') => React.cloneElement(component, { key });

export default [
  <Route exact path={actionCatalogPath} key="actionCatalog">
    {renderAsyncRouteChildren(ActionCatalogTab)}
  </Route>,
  <Route exact path={actionHistoryPath} key="InstanaActionHistory">
    {renderAsyncRouteChildren(ActionHistory)}
  </Route>,
  <Route
    exact
    path={[actionDetailsPath, actionDetailsCopyFormPath]}
    key="actionDetails"
    render={props => addKeyToComponent(renderAsyncRouteChildren(ActionDetailsPage), props.match.params?.id)}
  />,
  <Route exact path={policiesFullyQualified} key="policies">
    {renderAsyncRouteChildren(Policies)}
  </Route>,
  <Route
    path={policiesDetailsFullyQualified}
    key="policyDetails"
    render={props => addKeyToComponent(renderAsyncRouteChildren(PolicyDetails), props.match.params?.id)}
  />,
  <Route
    path={policiesOverviewFullyQualified}
    key="policyOverview"
    render={props => addKeyToComponent(renderAsyncRouteChildren(PolicyDashboard), props.match.params?.id)}
  />
];
