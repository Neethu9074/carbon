/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const ApplicationDashboard = () =>
  import(/* webpackChunkName: "cloudfoundry" */ 'in-cloudfoundry/Dashboards/Application/ApplicationDashboard');
const CloudfoundryMainView = () =>
  import(/* webpackChunkName: "cloudfoundry" */ 'in-cloudfoundry/CloudfoundryMainView');
import { Route } from 'react-router-dom';
import React from 'react';

import { applicationDashboardFullyQualified, cloudfoundry } from 'in-cloudfoundry/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

export default [
  <Route
    key="cloudfoundryApplicationDashboard"
    path={applicationDashboardFullyQualified}
    children={renderAsyncRouteChildren(ApplicationDashboard)}
  />,
  <Route key="cloudfoundryMainView" path={cloudfoundry} children={renderAsyncRouteChildren(CloudfoundryMainView)} />
];
