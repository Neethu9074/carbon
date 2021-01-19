/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { role } from 'in-stores/user';

// the following components are all part of the same bundle (application)
import CustomEndpointMapping from 'promise-loader?global,applications!in-applications/Forms/CustomEndpointMapping/CustomEndpointMappingDialog';
import CustomServiceMapping from 'promise-loader?global,applications!in-applications/Forms/CustomServiceMapping/CustomServiceMapping';
import SyntheticCallConfig from 'promise-loader?global,applications!in-applications/Forms/SyntheticCallConfig/SyntheticCallConfig';
import ApplicationDashboard from 'promise-loader?global,applications!in-applications/Dashboards/application/ApplicationDashboard';
import NewApplicationWaiter from 'promise-loader?global,applications!in-applications/Forms/NewApplication/NewApplicationWaiter';
import EndpointDashboard from 'promise-loader?global,applications!in-applications/Dashboards/endpoint/EndpointDashboard';
import ServiceDashboard from 'promise-loader?global,applications!in-applications/Dashboards/service/ServiceDashboard';
import NewApplication from 'promise-loader?global,applications!in-applications/Forms/NewApplication/NewApplication';
import ApplicationsList from 'promise-loader?global,applications!in-applications/lists/ApplicationsList';
import ServicesList from 'promise-loader?global,applications!in-applications/lists/ServicesList';

import {
  applicationsList,
  applicationDashboard,
  servicesList,
  serviceDashboard,
  endpointDashboard,
  newApplicationView,
  newApplicationWaiterView,
  newServiceView,
  configureSyntheticEndpointsView,
  configureEndpointsView
} from 'in-applications/navigation/paths';

export default (
  <Fragment>
    {role.canConfigureApplications && (
      <Route path={newApplicationView} component={createAsyncViewComponent(NewApplication)} />
    )}
    <Route
      path={`${newApplicationWaiterView}/:appId/:appName`}
      component={createAsyncViewComponent(NewApplicationWaiter)}
    />

    {role.canConfigureServiceMapping && (
      <Fragment>
        <Route path={newServiceView} component={createAsyncViewComponent(CustomServiceMapping)} />
        <Route path={configureSyntheticEndpointsView} component={createAsyncViewComponent(SyntheticCallConfig)} />
        <Route path={configureEndpointsView} component={createAsyncViewComponent(CustomEndpointMapping)} />
      </Fragment>
    )}

    <Route path={applicationsList} component={createAsyncViewComponent(ApplicationsList)} />
    <Route path={applicationDashboard} component={createAsyncViewComponent(ApplicationDashboard)} />
    <Route path={servicesList} component={createAsyncViewComponent(ServicesList)} />
    <Route path={serviceDashboard} component={createAsyncViewComponent(ServiceDashboard)} />
    <Route path={endpointDashboard} component={createAsyncViewComponent(EndpointDashboard)} />
  </Fragment>
);
