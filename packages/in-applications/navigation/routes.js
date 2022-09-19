/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import CustomEndpointMapping from 'promise-loader?global,applications!in-applications/Forms/CustomEndpointMapping/CustomEndpointMappingDialog';
import GlobalSmartAlertsTab from 'promise-loader?global,applications!in-alerting/smart-alerts/applications/inventory/GlobalSmartAlertsTab';
import CustomServiceMapping from 'promise-loader?global,applications!in-applications/Forms/CustomServiceMapping/CustomServiceMapping';
import SyntheticCallConfig from 'promise-loader?global,applications!in-applications/Forms/SyntheticCallConfig/SyntheticCallConfig';
import ApplicationDashboard from 'promise-loader?global,applications!in-applications/Dashboards/application/ApplicationDashboard';
import NewApplicationWaiter from 'promise-loader?global,applications!in-applications/Forms/NewApplication/NewApplicationWaiter';
import EndpointDashboard from 'promise-loader?global,applications!in-applications/Dashboards/endpoint/EndpointDashboard';
import ServiceDashboard from 'promise-loader?global,applications!in-applications/Dashboards/service/ServiceDashboard';
import AnalyzeView2_0 from 'promise-loader?global,applications!in-applications/analyze/AnalyzeView2_0/AnalyzeView';
import ApplicationsList from 'promise-loader?global,applications!in-applications/lists/ApplicationsList';
import ServicesList from 'promise-loader?global,applications!in-applications/lists/ServicesList';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

// the following components are all part of the same bundle (application)
import {
  alertsList,
  applicationDashboard,
  applicationsList,
  configureEndpointsView,
  configureSyntheticEndpointsView,
  endpointDashboard,
  newApplicationWaiterView,
  newServiceView,
  serviceDashboard,
  servicesList,
  analyzePath
} from 'in-applications/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';

export default (
  <Fragment>
    <Route
      path={`${newApplicationWaiterView}/:appId/:appName`}
      children={renderAsyncRouteChildren(NewApplicationWaiter)}
    />

    {role.canConfigureServiceMapping && (
      <Fragment>
        <Route path={newServiceView} children={renderAsyncRouteChildren(CustomServiceMapping)} />
        <Route path={configureSyntheticEndpointsView} children={renderAsyncRouteChildren(SyntheticCallConfig)} />
        <Route path={configureEndpointsView} children={renderAsyncRouteChildren(CustomEndpointMapping)} />
      </Fragment>
    )}

    <Route path={applicationsList} children={renderAsyncRouteChildren(ApplicationsList)} />
    <Route path={applicationDashboard} children={renderAsyncRouteChildren(ApplicationDashboard)} />
    <Route path={servicesList} children={renderAsyncRouteChildren(ServicesList)} />
    <Route path={serviceDashboard} children={renderAsyncRouteChildren(ServiceDashboard)} />
    <Route path={endpointDashboard} children={renderAsyncRouteChildren(EndpointDashboard)} />
    {applicationSmartAlertsEnabled && (
      <Route path={alertsList} children={renderAsyncRouteChildren(GlobalSmartAlertsTab)} />
    )}

    <Route path={analyzePath} children={renderAsyncRouteChildren(AnalyzeView2_0)} />
  </Fragment>
);
