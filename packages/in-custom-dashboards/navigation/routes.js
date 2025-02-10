/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// all the lazy loaded views. Bundle name: customDashboarding
import CustomDashboard from 'promise-loader?global,customDashboarding!in-custom-dashboards/CustomDashboard/CustomDashboard';
import CustomDashboardsPage from 'promise-loader?global,customDashboarding!in-custom-dashboards/pages/CustomDashboards';
import { Route } from 'react-router-dom';
import React from 'react';

import { viewPathFullyQualified, customDashboardsPath } from 'in-custom-dashboards/navigation/url';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { welcomePage } from 'in-plg/navigation/paths';

export default [
  <Route key="customDashboardPage" path={viewPathFullyQualified}>
    {renderAsyncRouteChildren(CustomDashboard)}
  </Route>,
  <Route key="customDashboards" path={customDashboardsPath}>
    {renderAsyncRouteChildren(CustomDashboardsPage)}
  </Route>,
  <RedirectWithHash key="customDashboardRedirectToHome" from={customDashboardsPath} to={welcomePage} />
];
