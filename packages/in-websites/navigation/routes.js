/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

// all the lazy loaded views. Bundle name: websites
const WebsiteDashboard = () =>
  import(/* webpackChunkName: "websites" */ 'in-websites/WebsiteDashboard/WebsiteDashboard');
const ConversionGoalDetails = () =>
  import(/* webpackChunkName: "websites" */ 'in-websites/WebsiteDashboard/tabs/BusinessImpact/ConversionGoalDetails');
const AlertConfigTearSheet = () =>
  import(/* webpackChunkName: "websites" */ 'in-alerting/smart-alerts/websites/TearSheet/AlertConfigTearSheet');
const AnalyzeView2_0 = () =>
  import(/* webpackChunkName: "websites" */ 'in-websites/analyze/AnalyzeView2_0/AnalyzeView');
const NewWebsiteFlow = () => import(/* webpackChunkName: "websites" */ 'in-websites/NewWebsiteFlow/NewWebsiteFlow');
const WebsitesList = () => import(/* webpackChunkName: "websites" */ 'in-websites/WebsitesList/WebsitesList');
import { Route } from 'react-router-dom';
import React from 'react';

import {
  websitesPathFullyQualified,
  websiteMonitoringPath,
  websitePathFullyQualified,
  newWebsitePathFullyQualified,
  analyzePathFullyQualified,
  websiteSmartAlertsFullScreenFullyQualified,
  businessConversionGoalDashboardFullyQualified
} from 'in-websites/navigation/paths';
import {
  websitesSmartAlertFullScreenDesignEnabled,
  websitesSmartAlertDialogViewEnabled,
  websitesBusinessConversionGoalsEnabled
} from 'in-services/featureFlags';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { FULLSCREEN, CHOICE_DIALOG } from 'in-alerting/smart-alerts/data/constants';
import RedirectWithHash from 'in-components/RedirectWithHash';

const alertDisplayMode = getSmartAlertDisplayMode(
  websitesSmartAlertDialogViewEnabled,
  websitesSmartAlertFullScreenDesignEnabled
);

export default [
  <Route key="websitesList" path={websitesPathFullyQualified}>
    {renderAsyncRouteChildren(WebsitesList)}
  </Route>,
  websitesBusinessConversionGoalsEnabled && (
    <Route key="conversionGoalDetails" path={businessConversionGoalDashboardFullyQualified}>
      {renderAsyncRouteChildren(ConversionGoalDetails)}
    </Route>
  ),
  <Route key="websiteDashboard" path={websitePathFullyQualified}>
    {renderAsyncRouteChildren(WebsiteDashboard)}
  </Route>,
  <Route key="websiteNew" path={newWebsitePathFullyQualified}>
    {renderAsyncRouteChildren(NewWebsiteFlow)}
  </Route>,
  <Route key="websiteAnalyzeBeacons" path={analyzePathFullyQualified}>
    {renderAsyncRouteChildren(AnalyzeView2_0)}
  </Route>,
  (alertDisplayMode === FULLSCREEN || alertDisplayMode === CHOICE_DIALOG) && (
    <Route key="websiteFullScreenView" path={websiteSmartAlertsFullScreenFullyQualified}>
      {renderAsyncRouteChildren(AlertConfigTearSheet)}
    </Route>
  ),
  <RedirectWithHash key="redirectToWebsitesList" from={websiteMonitoringPath} to={websitesPathFullyQualified} />
];
