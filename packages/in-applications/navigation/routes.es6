import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';

// the following components are all part of the same bundle.
// Bundle Name: applications
import ApplicationDashboard from 'promise-loader?global,applications!in-applications/Dashboards/application/ApplicationDashboard';
import CustomServiceMapping from 'promise-loader?global,applications!in-applications/CustomServiceMapping/CustomServiceMapping';
import EndpointDashboard from 'promise-loader?global,applications!in-applications/Dashboards/endpoint/EndpointDashboard';
import ServiceDashboard from 'promise-loader?global,applications!in-applications/Dashboards/service/ServiceDashboard';
import NewApplication from 'promise-loader?global,applications!in-applications/NewApplication/NewApplication';
import ApplicationsList from 'promise-loader?global,applications!in-applications/lists/ApplicationsList';
import ServicesList from 'promise-loader?global,applications!in-applications/lists/ServicesList';

import {
  applicationsList,
  applicationDashboard,
  servicesList,
  serviceDashboard,
  endpointDashboard,
  newApplicationView,
  newServiceView
} from 'in-applications/navigation/paths';

export default (
  <Fragment>
    <Route path={newApplicationView} component={createAsyncViewComponent(NewApplication)} />
    <Route path={applicationsList} component={createAsyncViewComponent(ApplicationsList)} />
    <Route path={applicationDashboard} component={createAsyncViewComponent(ApplicationDashboard)} />
    <Route path={newServiceView} component={createAsyncViewComponent(CustomServiceMapping)} />
    <Route path={servicesList} component={createAsyncViewComponent(ServicesList)} />
    <Route path={serviceDashboard} component={createAsyncViewComponent(ServiceDashboard)} />
    <Route path={endpointDashboard} component={createAsyncViewComponent(EndpointDashboard)} />
  </Fragment>
);
