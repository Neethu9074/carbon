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
import React from 'react';

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

export default function applicationRoutes() {
  let appRoutes = [
    <Route
      key="newApplicationWaiter"
      path={`${newApplicationWaiterView}/:appId/:appName`}
      children={renderAsyncRouteChildren(NewApplicationWaiter)}
    />,
    <Route key="applicationslist" path={applicationsList} children={renderAsyncRouteChildren(ApplicationsList)} />,
    <Route
      key="applicationDashboard"
      path={applicationDashboard}
      children={renderAsyncRouteChildren(ApplicationDashboard)}
    />,
    <Route key="servicesList" path={servicesList} children={renderAsyncRouteChildren(ServicesList)} />,
    <Route key="serviceDashboard" path={serviceDashboard} children={renderAsyncRouteChildren(ServiceDashboard)} />,
    <Route key="endpointDashboard" path={endpointDashboard} children={renderAsyncRouteChildren(EndpointDashboard)} />,
    <Route key="analyze" path={analyzePath} children={renderAsyncRouteChildren(AnalyzeView2_0)} />
  ];

  if (role.canConfigureServiceMapping) {
    appRoutes.push(
      <Route key="newServiceView" path={newServiceView} children={renderAsyncRouteChildren(CustomServiceMapping)} />,
      <Route
        key="configureSyntheticEndpoints"
        path={configureSyntheticEndpointsView}
        children={renderAsyncRouteChildren(SyntheticCallConfig)}
      />,
      <Route
        key="configureEndpoints"
        path={configureEndpointsView}
        children={renderAsyncRouteChildren(CustomEndpointMapping)}
      />
    );
  }
  if (applicationSmartAlertsEnabled) {
    appRoutes.push(
      <Route key="alertsList" path={alertsList} children={renderAsyncRouteChildren(GlobalSmartAlertsTab)} />
    );
  }

  return appRoutes;
}
