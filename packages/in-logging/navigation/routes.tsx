/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

//@ts-expect-error
import DashboardSmartAlertDetailsView from 'promise-loader?global,logging!in-logging/dashboard/SmartAlerts/SmartAlertDetails';
//@ts-expect-error
import AlertConfigTearSheet from 'promise-loader?global,logging!in-alerting/smart-alerts/logs/tearsheet/AlertConfigTearSheet';
//@ts-expect-error
import SmartAlertDetailsView from 'promise-loader?global,logging!!in-alerting/smart-alerts/logs/details/AlertDetails';
//@ts-expect-error needs TS migration
import AnalyzeView from 'promise-loader?global,logging!in-logging/analyze/AnalyzeView/AnalyzeView';
//@ts-expect-error
import LoggingDashboardWrapper from 'promise-loader?global,logging!in-logging/dashboard/LoggingDashboardWrapper';
//@ts-expect-error
import RetentionPeriod from 'promise-loader?global,logging!in-logging/dashboard/Configuration/RetentionPeriod';
//@ts-expect-error
import LogIntegrations from 'promise-loader?global,logging!in-logging/dashboard/Configuration/LogIntegrations';
//@ts-expect-error
import Configuration from 'promise-loader?global,logging!in-logging/dashboard/Configuration/Configuration';
//@ts-expect-error needs TS migration
import DeleteLogs from 'promise-loader?global,logging!in-logging/dashboard/DeleteLogs';
//@ts-expect-error
import SmartAlerts from 'promise-loader?global,logging!in-logging/dashboard/SmartAlerts/SmartAlerts';
//@ts-expect-error
import LogVolume from 'promise-loader?global,logging!in-logging/dashboard/Configuration/LogVolume';
//@ts-expect-error
import SmartAlertList from 'promise-loader?global,logging!in-alerting/smart-alerts/logs/Alerts';
//@ts-expect-error
import Summary from 'promise-loader?global,logging!in-logging/dashboard/Summary/Summary';
import { Route } from 'react-router-dom';
import React from 'react';

import {
  alertDetailsFullyQualifiedPath,
  alertsFullyQualifiedPath,
  loggingDashboardPath,
  logsPath,
  dashboardSmartAlertsPath,
  dashboardDeletePath,
  dashboardConfigurationPath,
  dashboardAlertDetailsFullPath,
  dashboardRetentionConfigurationPath,
  dashboardLogVolumePath,
  dashboardIntegrationsPath,
  logSmartAlertsFullScreen
} from 'in-logging/navigation/paths';
//@ts-expect-error needs TS migration
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { logSmartAlertFullScreenDesignEnabled } from 'in-services/featureFlags';

export default [
  <Route key="logsSmartAlertDetails" path={alertDetailsFullyQualifiedPath}>
    {renderAsyncRouteChildren(SmartAlertDetailsView)}
  </Route>,
  <Route key="logsSmartAlertsList" path={alertsFullyQualifiedPath}>
    {renderAsyncRouteChildren(SmartAlertList)}
  </Route>,
  <Route key="logsAnalyze" path={logsPath}>
    {renderAsyncRouteChildren(AnalyzeView)}
  </Route>,
  <Route key="loggingDashboardConfiguation" path={dashboardRetentionConfigurationPath}>
    {renderAsyncRouteChildren(RetentionPeriod)}
  </Route>,
  <Route key="loggingDashboardConfiguation" path={dashboardLogVolumePath}>
    {renderAsyncRouteChildren(LogVolume)}
  </Route>,
  <Route key="loggingDashboardConfiguation" path={dashboardIntegrationsPath}>
    {renderAsyncRouteChildren(LogIntegrations)}
  </Route>,
  <Route key="loggingDashboardConfiguation" path={dashboardConfigurationPath}>
    {renderAsyncRouteChildren(Configuration)}
  </Route>,
  <Route key="loggingDashboardAlertsDetails" path={dashboardAlertDetailsFullPath}>
    {renderAsyncRouteChildren(DashboardSmartAlertDetailsView)}
  </Route>,
  <Route key="loggingDashboardAlerts" path={dashboardSmartAlertsPath}>
    {renderAsyncRouteChildren(SmartAlerts)}
  </Route>,
  <Route key="loggingDashboardDelete" path={dashboardDeletePath}>
    {renderAsyncRouteChildren(DeleteLogs)}
  </Route>,
  <Route key="loggingDashboard" path={loggingDashboardPath}>
    {renderAsyncRouteChildren(Summary)}
  </Route>,
  <Route key="loggingDashboardWrapper" path={`${loggingDashboardPath}/:subpath?`}>
    {renderAsyncRouteChildren(LoggingDashboardWrapper)}
  </Route>,
  logSmartAlertFullScreenDesignEnabled && (
    <Route key="infraSmartAlert" path={logSmartAlertsFullScreen}>
      {renderAsyncRouteChildren(AlertConfigTearSheet)}
    </Route>
  )
];
