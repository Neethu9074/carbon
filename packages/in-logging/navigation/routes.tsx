/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const PatternRecognition = () =>
  import(/* webpackChunkName: "logging" */ 'in-logging/dashboard/Management/PatternRecognition');
const DashboardSmartAlertDetailsView = () =>
  import(/* webpackChunkName: "logging" */ 'in-logging/dashboard/SmartAlerts/SmartAlertDetails');
const AlertConfigTearSheet = () =>
  import(/* webpackChunkName: "logging" */ 'in-alerting/smart-alerts/logs/tearsheet/AlertConfigTearSheet');
const SmartAlertDetailsView = () =>
  import(/* webpackChunkName: "logging" */ 'in-alerting/smart-alerts/logs/details/AlertDetails');
const LoggingAnalytics = () => import(/* webpackChunkName: "logging" */ 'in-logging/analyze/LoggingAnalytics');
const LoggingDashboardWrapper = () =>
  import(/* webpackChunkName: "logging" */ 'in-logging/dashboard/LoggingDashboardWrapper');
const RetentionPeriod = () =>
  import(/* webpackChunkName: "logging" */ 'in-logging/dashboard/Management/RetentionPeriod');
const LogIntegrations = () =>
  import(/* webpackChunkName: "logging" */ 'in-logging/dashboard/Management/LogIntegrations');
const DeleteLogs = () => import(/* webpackChunkName: "logging" */ 'in-logging/dashboard/DeleteLogs');
const SmartAlerts = () => import(/* webpackChunkName: "logging" */ 'in-logging/dashboard/SmartAlerts/SmartAlerts');
const Management = () => import(/* webpackChunkName: "logging" */ 'in-logging/dashboard/Management/Management');
const LogVolume = () => import(/* webpackChunkName: "logging" */ 'in-logging/dashboard/Management/LogVolume');
const SmartAlertList = () => import(/* webpackChunkName: "logging" */ 'in-alerting/smart-alerts/logs/Alerts');
const Summary = () => import(/* webpackChunkName: "logging" */ 'in-logging/dashboard/Summary/Summary');
import { Route } from 'react-router-dom';
import React from 'react';

import {
  alertDetailsFullyQualifiedPath,
  alertsFullyQualifiedPath,
  loggingDashboardPath,
  logsPath,
  dashboardSmartAlertsPath,
  dashboardDeletePath,
  dashboardManagementPath,
  dashboardAlertDetailsFullPath,
  dashboardRetentionManagementPath,
  dashboardLogVolumePath,
  dashboardIntegrationsPath,
  logSmartAlertsFullScreenFullyQualifiedPath,
  dashboardPatternRecognitionPath
} from 'in-logging/navigation/paths';
//@ts-expect-error needs TS migration
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { logSmartAlertFullScreenDesignEnabled, logSmartAlertDialogViewEnabled } from 'in-services/featureFlags';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import { FULLSCREEN, CHOICE_DIALOG } from 'in-alerting/smart-alerts/data/constants';

const alertDisplayMode = getSmartAlertDisplayMode(logSmartAlertDialogViewEnabled, logSmartAlertFullScreenDesignEnabled);

export default [
  <Route key="logsSmartAlertDetails" path={alertDetailsFullyQualifiedPath}>
    {renderAsyncRouteChildren(SmartAlertDetailsView)}
  </Route>,
  <Route key="logsSmartAlertsList" path={alertsFullyQualifiedPath}>
    {renderAsyncRouteChildren(SmartAlertList)}
  </Route>,
  <Route key="logsAnalyze" path={logsPath}>
    {renderAsyncRouteChildren(LoggingAnalytics)}
  </Route>,
  <Route key="loggingDashboardManagement" path={dashboardRetentionManagementPath}>
    {renderAsyncRouteChildren(RetentionPeriod)}
  </Route>,
  <Route key="loggingDashboardManagement" path={dashboardLogVolumePath}>
    {renderAsyncRouteChildren(LogVolume)}
  </Route>,
  <Route key="loggingDashboardManagement" path={dashboardIntegrationsPath}>
    {renderAsyncRouteChildren(LogIntegrations)}
  </Route>,
  <Route key="loggingDashboardManagement" path={dashboardPatternRecognitionPath}>
    {renderAsyncRouteChildren(PatternRecognition)}
  </Route>,
  (alertDisplayMode === FULLSCREEN || alertDisplayMode === CHOICE_DIALOG) && (
    <Route key="logSmartAlert" path={logSmartAlertsFullScreenFullyQualifiedPath} exact>
      {renderAsyncRouteChildren(AlertConfigTearSheet)}
    </Route>
  ),
  <Route key="loggingDashboardManagement" path={dashboardManagementPath}>
    {renderAsyncRouteChildren(Management)}
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
  </Route>
];
