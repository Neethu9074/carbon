import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';

// the following components are all part of the same bundle.
// Bundle Name: applications
import DatabaseStatementDetail from 'promise-loader?global,applications!in-applications/Dashboards/commonTabs/performance/database/DatabaseStatementDetail.es6';
import ApplicationDashboard from 'promise-loader?global,applications!in-applications/Dashboards/application/ApplicationDashboard';
import EndpointDashboard from 'promise-loader?global,applications!in-applications/Dashboards/endpoint/EndpointDashboard';
import ServiceDashboard from 'promise-loader?global,applications!in-applications/Dashboards/service/ServiceDashboard';
import ApplicationsList from 'promise-loader?global,applications!in-applications/lists/ApplicationsList';
import ServicesList from 'promise-loader?global,applications!in-applications/lists/ServicesList';

import {
  applicationsList,
  applicationDashboard,
  servicesList,
  serviceDashboard,
  endpointDashboard,
  databaseStatementDetailsPath
} from 'in-applications/navigation/paths';

export default (
  <Fragment>
    <Route path={applicationsList} component={createAsyncViewComponent(ApplicationsList)} />
    <Route path={applicationDashboard} component={createAsyncViewComponent(ApplicationDashboard)} />
    <Route path={servicesList} component={createAsyncViewComponent(ServicesList)} />
    <Route path={serviceDashboard} component={createAsyncViewComponent(ServiceDashboard)} />
    <Route path={endpointDashboard} component={createAsyncViewComponent(EndpointDashboard)} />
    <Route path={databaseStatementDetailsPath} component={createAsyncViewComponent(DatabaseStatementDetail)} />
  </Fragment>
);
