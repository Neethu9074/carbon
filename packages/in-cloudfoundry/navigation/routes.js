/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import ApplicationDashboard from 'promise-loader?global,cloudfoundry!in-cloudfoundry/Dashboards/Application/ApplicationDashboard';
import CloudfoundryMainView from 'promise-loader?global,cloudfoundry!in-cloudfoundry/CloudfoundryMainView';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { applicationDashboardFullyQualified, cloudfoundry } from 'in-cloudfoundry/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';

export default (
  <Fragment>
    <Route path={applicationDashboardFullyQualified} component={createAsyncViewComponent(ApplicationDashboard)} />
    <Route path={cloudfoundry} component={createAsyncViewComponent(CloudfoundryMainView)} />
  </Fragment>
);
