/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import CustomEndpointMapping from 'promise-loader?global,applications!in-applications/Forms/CustomEndpointMapping/CustomEndpointMappingDialog';
import AlertConfigTearSheet from 'promise-loader?global,applications!in-alerting/smart-alerts/applications/tearSheet/AlertConfigTearSheet';
import CustomServiceMapping from 'promise-loader?global,applications!in-applications/Forms/CustomServiceMapping/CustomServiceMapping';
import SyntheticCallConfig from 'promise-loader?global,applications!in-applications/Forms/SyntheticCallConfig/SyntheticCallConfig';
import ApplicationDashboard from 'promise-loader?global,applications!in-applications/Dashboards/application/ApplicationDashboard';
import GlobalSmartAlerts from 'promise-loader?global,applications!in-alerting/smart-alerts/applications/list/GlobalSmartAlerts';
import NewApplicationWaiter from 'promise-loader?global,applications!in-applications/Forms/NewApplication/NewApplicationWaiter';
import EndpointDashboard from 'promise-loader?global,applications!in-applications/Dashboards/endpoint/EndpointDashboard';
import SubtraceDashboard from 'promise-loader?global,applications!in-applications/Dashboards/subtrace/SubtraceDashboard';
import ServiceDashboard from 'promise-loader?global,applications!in-applications/Dashboards/service/ServiceDashboard';
import AnalyzeView2_0 from 'promise-loader?global,applications!in-applications/analyze/AnalyzeView2_0/AnalyzeView';
import ApplicationsList from 'promise-loader?global,applications!in-applications/lists/ApplicationsList';
import SubtracesList from 'promise-loader?global,applications!in-applications/lists/SubtracesList';
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
  analyzePath,
  smartAlertPath,
  subtracesList,
  subtraceDashboard
} from 'in-applications/navigation/paths';
import { applicationSmartAlertFullScreenDesignEnabled, applicationSubtracesEnabled } from 'in-services/featureFlags';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { role } from 'in-stores/user';

export default function applicationRoutes() {
  const appRoutes = [];
  if (role.canConfigureServiceMapping) {
    appRoutes.push(
      <Route key="applicationPerspectiveNewServiceView" path={newServiceView}>
        {renderAsyncRouteChildren(CustomServiceMapping)}
      </Route>,
      <Route key="applicationPerspectiveConfigureSyntheticEndpoints" path={configureSyntheticEndpointsView}>
        {renderAsyncRouteChildren(SyntheticCallConfig)}
      </Route>,
      <Route key="applicationPerspectiveConfigureEndpoints" path={configureEndpointsView}>
        {renderAsyncRouteChildren(CustomEndpointMapping)}
      </Route>
    );
  }
  appRoutes.push([
    applicationSmartAlertFullScreenDesignEnabled && (
      <Route exact path={[smartAlertPath]} key="applicationPerspectiveSmartAlerts">
        {renderAsyncRouteChildren(AlertConfigTearSheet)}
      </Route>
    ),
    <Route key="applicationPerspectiveNewApplicationWaiter" path={`${newApplicationWaiterView}/:appId/:appName`}>
      {renderAsyncRouteChildren(NewApplicationWaiter)}
    </Route>,
    <Route key="applicationPerspectiveApplicationslist" path={applicationsList}>
      {renderAsyncRouteChildren(ApplicationsList)}
    </Route>,
    <Route key="applicationPerspectiveApplicationDashboard" path={applicationDashboard}>
      {renderAsyncRouteChildren(ApplicationDashboard)}
    </Route>,
    <Route key="applicationPerspectiveServicesList" path={servicesList}>
      {renderAsyncRouteChildren(ServicesList)}
    </Route>,
    <Route key="applicationPerspectiveServiceDashboard" path={serviceDashboard}>
      {renderAsyncRouteChildren(ServiceDashboard)}
    </Route>,
    <Route key="applicationPerspectiveEndpointDashboard" path={endpointDashboard}>
      {renderAsyncRouteChildren(EndpointDashboard)}
    </Route>,
    <Route key="applicationPerspectiveAnalyze" path={analyzePath}>
      {renderAsyncRouteChildren(AnalyzeView2_0)}
    </Route>,
    <Route key="applicationPerspectiveAlertsList" path={alertsList}>
      {renderAsyncRouteChildren(GlobalSmartAlerts)}
    </Route>
  ]);

  if (applicationSubtracesEnabled) {
    appRoutes.push([
      <Route key="applicationPerspectiveSubtracesList" path={subtracesList}>
        {renderAsyncRouteChildren(SubtracesList)}
      </Route>,
      <Route key="applicationPerspectiveSubtraceDashboard" path={subtraceDashboard}>
        {renderAsyncRouteChildren(SubtraceDashboard)}
      </Route>
    ]);
  }

  return appRoutes;
}
