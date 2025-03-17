/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

// @ts-expect-error module need to be translated to TS
import SyntheticCredentialView from 'promise-loader?global,synthetics!in-synthetics/dashboards/global/CredentialList';
// @ts-expect-error module need to be translated to TS
import SyntheticLocationView from 'promise-loader?global,synthetics!in-synthetics/dashboards/global/LocationList';
// @ts-expect-error module need to be translated to TS
import SyntheticsView from 'promise-loader?global,synthetics!in-synthetics/dashboards/global/TestSummaryList';
// @ts-expect-error module need to be translated to TS
import SmartAlertList from 'promise-loader?global,synthetics!in-synthetics/dashboards/global/SmartAlertList';
// @ts-expect-error module need to be translated to TS
import AnalyzeView from 'promise-loader?global,synthetics!in-synthetics/dashboards/details/AnalyzeView';
//@ts-expect-error
import AlertConfigTearSheet from 'promise-loader?global,synthetics!in-alerting/smart-alerts/synthetics/tearsheet/AlertConfigTearSheet';
//@ts-expect-error
import SyntheticSummaryDashboard from 'promise-loader?global,synthetics!in-synthetics/dashboards/summary/SyntheticSummary';
//@ts-expect-error
import AlertDetailsView from 'promise-loader?global,synthetics!in-synthetics/dashboards/global/AlertDetailsView';
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
import { syntheticSmartAlertFullScreenDesignEnabled } from 'in-services/featureFlags';

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
  syntheticSmartAlertFullScreenDesignEnabled && (
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
