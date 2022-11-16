/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// all the lazy loaded views. Bundle name: customDashboarding
import CustomDashboard from 'promise-loader?global,customDashboarding!in-custom-dashboards/CustomDashboard/CustomDashboard';
import { Route } from 'react-router-dom';
import React from 'react';

import { viewPathFullyQualified, customDashboardsPath } from 'in-custom-dashboards/navigation/url';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { cockpit } from 'in-cockpit/navigation/paths';

export default [
  <Route path={viewPathFullyQualified} children={renderAsyncRouteChildren(CustomDashboard)} />,
  <RedirectWithHash from={customDashboardsPath} to={cockpit} />
];
