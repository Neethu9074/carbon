/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// all the lazy loaded views. Bundle name: mobileApps
import MobileAppDashboard from 'promise-loader?global,mobileApps!in-mobile-apps/MobileAppDashboard/MobileAppDashboard';
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
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default [
  <Route
    key="mobileAppsList"
    path={mobileAppsPathFullyQualified}
    children={renderAsyncRouteChildren(MobileAppsList)}
  />,
  <Route
    key="mobileAppNew"
    path={newMobileAppPathFullyQualified}
    children={renderAsyncRouteChildren(NewMobileAppFlow)}
  />,
  <Route
    key="mobileAppDashboard"
    path={mobileAppPathFullyQualified}
    children={renderAsyncRouteChildren(MobileAppDashboard)}
  />,
  <Route
    key="mobileAppAnalyzeBeacons"
    path={analyzePathFullyQualified}
    children={renderAsyncRouteChildren(AnalyzeView2_0)}
  />,
  <RedirectWithHash key="redirectToMobileAppsList" from={mobileAppMonitoringPath} to={mobileAppsPathFullyQualified} />
];
