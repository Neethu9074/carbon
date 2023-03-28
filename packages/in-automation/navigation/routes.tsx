/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import ActionCatalogTab from 'promise-loader?global!in-automation/ActionCatalog/ActionCatalog';
// @ts-expect-error
import ActionDetailsPage from 'promise-loader?global!in-automation/ActionCatalog/Action';
import { Route } from 'react-router';
import React from 'react';

import { actionCatalogPath, actionDetailsPath, actionDetailsCopyFormPath } from 'in-automation/navigation/paths';
// @ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

export default [
  <Route exact path={actionCatalogPath} key="actionCatalog">
    {renderAsyncRouteChildren(ActionCatalogTab)}
  </Route>,
  <Route exact path={[actionDetailsPath, actionDetailsCopyFormPath]} key="actionDetails">
    {renderAsyncRouteChildren(ActionDetailsPage)}
  </Route>
];
