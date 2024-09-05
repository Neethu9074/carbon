/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error promis-loader cause failures when importing in typescript
import NutanixMainView from 'promise-loader?global,nutanix!in-nutanix/NutanixMainView';
import { Route } from 'react-router-dom';
import React from 'react';

// @ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { nutanix, nutanixClusterListFullyQualified } from 'in-nutanix/navigation/paths';

export default [
  <Route key="NutanixClusterDashboard" path={nutanixClusterListFullyQualified}>
    {renderAsyncRouteChildren(NutanixMainView)}
  </Route>,

  <Route key="nutanixMainView" path={nutanix}>
    {renderAsyncRouteChildren(NutanixMainView)}
  </Route>
];
