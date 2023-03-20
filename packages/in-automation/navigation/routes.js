/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import ActionCatalogTab from 'promise-loader?global!in-automation/ActionCatalog/ActionCatalogTab';
import { Route } from 'react-router-dom';
import React from 'react';

import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { automationPath } from 'in-automation/navigation/paths';

export default [
  <Route
    path={automationPath}
    children={renderAsyncRouteChildren(ActionCatalogTab)}
    windowTitle="Instana Action Catalog"
  />
];
