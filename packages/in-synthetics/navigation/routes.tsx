/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

const SyntheticCredentialView = () =>
  import(/* webpackChunkName: "synthetics" */ 'in-synthetics/dashboards/global/CredentialList');
const SyntheticLocationView = () =>
  import(/* webpackChunkName: "synthetics" */ 'in-synthetics/dashboards/global/LocationList');
const SyntheticsView = () =>
  import(/* webpackChunkName: "synthetics" */ 'in-synthetics/dashboards/global/TestSummaryList');
const SmartAlertList = () =>
  import(/* webpackChunkName: "synthetics" */ 'in-synthetics/dashboards/global/SmartAlertList');
const AnalyzeView = () => import(/* webpackChunkName: "synthetics" */ 'in-synthetics/dashboards/details/AnalyzeView');
const AlertConfigTearSheet = () =>
  import(/* webpackChunkName: "synthetics" */ 'in-alerting/smart-alerts/synthetics/tearsheet/AlertConfigTearSheet');
const SyntheticSummaryDashboard = () =>
  import(/* webpackChunkName: "synthetics" */ 'in-synthetics/dashboards/summary/SyntheticSummary');
const AlertDetailsView = () =>
  import(/* webpackChunkName: "synthetics" */ 'in-synthetics/dashboards/global/AlertDetailsView');
import { Route } from 'react-router-dom';
import React from 'react';

import {
  syntheticsPath,
  syntheticLocationPath,
  syntheticsDashboard,
  syntheticDetailsPath,
  syntheticSmartAlertsPath,
  alertsTabDetailsFullyQualified,
  dashboardTestAlertsTabDetailsFullyQualified,
  syntheticCredentialPath,
  syntheticSmartAlertsFullScreen
} from 'in-synthetics/navigation/paths';
// @ts-expect-error module need to be translated to TS
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import {
  syntheticSmartAlertFullScreenDesignEnabled,
  syntheticSmartAlertDialogViewEnabled
} from 'in-services/featureFlags';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import { FULLSCREEN, CHOICE_DIALOG } from 'in-alerting/smart-alerts/data/constants';

const alertDisplayMode = getSmartAlertDisplayMode(
  syntheticSmartAlertDialogViewEnabled,
  syntheticSmartAlertFullScreenDesignEnabled
);

export default [
  <Route key="syntheticTests" exact path={syntheticsPath}>
    {renderAsyncRouteChildren(SyntheticsView)}
  </Route>,
  <Route key="syntheticLocations" exact path={syntheticLocationPath}>
    {renderAsyncRouteChildren(SyntheticLocationView)}
  </Route>,
  <Route key="syntheticSmartAlerts" exact path={syntheticSmartAlertsPath}>
    {renderAsyncRouteChildren(SmartAlertList)}
  </Route>,
  (alertDisplayMode === FULLSCREEN || alertDisplayMode === CHOICE_DIALOG) && (
    <Route key="syntheticSmartAlert" path={syntheticSmartAlertsFullScreen}>
      {renderAsyncRouteChildren(AlertConfigTearSheet)}
    </Route>
  ),
  <Route key="details" path={alertsTabDetailsFullyQualified}>
    {renderAsyncRouteChildren(AlertDetailsView)}
  </Route>,
  <Route key="details" path={dashboardTestAlertsTabDetailsFullyQualified}>
    {renderAsyncRouteChildren(AlertDetailsView)}
  </Route>,
  <Route key="syntheticsDashboard" path={syntheticsDashboard}>
    {renderAsyncRouteChildren(SyntheticSummaryDashboard)}
  </Route>,
  <Route key="syntheticDetails" path={syntheticDetailsPath}>
    {renderAsyncRouteChildren(AnalyzeView)}
  </Route>,
  <Route key="syntheticCredentials" path={syntheticCredentialPath}>
    {renderAsyncRouteChildren(SyntheticCredentialView)}
  </Route>
];
