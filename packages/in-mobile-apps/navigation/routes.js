/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// all the lazy loaded views. Bundle name: mobileApps
import MobileAppDashboard from 'promise-loader?global,mobileApps!in-mobile-apps/MobileAppDashboard/MobileAppDashboard';
import AlertConfigTearSheet from 'promise-loader?global,mobileApps!in-alerting/smart-alerts/mobileApp/TearSheet/AlertConfigTearSheet';
import NewMobileAppFlow from 'promise-loader?global,mobileApps!in-mobile-apps/NewMobileAppFlow/NewMobileAppFlow';
import AnalyzeView2_0 from 'promise-loader?global,mobileApps!in-mobile-apps/analyze/AnalyzeView2_0/AnalyzeView';
import MobileAppsList from 'promise-loader?global,mobileApps!in-mobile-apps/MobileAppsList/MobileAppsList';
import { Route } from 'react-router-dom';
import React from 'react';

import {
  mobileAppsPathFullyQualified,
  mobileAppMonitoringPath,
  mobileAppPathFullyQualified,
  newMobileAppPathFullyQualified,
  analyzePathFullyQualified
} from 'in-mobile-apps/navigation/paths';
import { mobileAppSmartAlertsFullScreenFullyQualified } from 'in-mobile-apps/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default [
  <Route key="mobileAppsList" path={mobileAppsPathFullyQualified}>
    {renderAsyncRouteChildren(MobileAppsList)}
  </Route>,
  <Route key="mobileAppNew" path={newMobileAppPathFullyQualified}>
    {renderAsyncRouteChildren(NewMobileAppFlow)}
  </Route>,
  <Route key="mobileAppDashboard" path={mobileAppPathFullyQualified}>
    {renderAsyncRouteChildren(MobileAppDashboard)}
  </Route>,
  <Route key="mobileAppAnalyzeBeacons" path={analyzePathFullyQualified}>
    {renderAsyncRouteChildren(AnalyzeView2_0)}
  </Route>,
  <Route key="mobileAppSmartAlertsFullScreenFullyQualified" path={mobileAppSmartAlertsFullScreenFullyQualified}>
    {renderAsyncRouteChildren(AlertConfigTearSheet)}
  </Route>,
  <RedirectWithHash key="redirectToMobileAppsList" from={mobileAppMonitoringPath} to={mobileAppsPathFullyQualified} />
];
