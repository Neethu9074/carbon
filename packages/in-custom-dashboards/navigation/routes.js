/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// all the lazy loaded views. Bundle name: customDashboarding
import CustomDashboard from 'promise-loader?global,customDashboarding!in-custom-dashboards/CustomDashboard/CustomDashboard';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { viewPathFullyQualified, customDashboardsPath } from 'in-custom-dashboards/navigation/url';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { cockpit } from 'in-cockpit/navigation/paths';

export default (
  <Fragment>
    <Route path={viewPathFullyQualified} component={createAsyncViewComponent(CustomDashboard)} />
    <RedirectWithHash from={customDashboardsPath} to={cockpit} />
  </Fragment>
);
