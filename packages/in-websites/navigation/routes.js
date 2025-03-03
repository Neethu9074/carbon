/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// all the lazy loaded views. Bundle name: websites
import WebsiteDashboard from 'promise-loader?global,websites!in-websites/WebsiteDashboard/WebsiteDashboard';
import AlertConfigTearSheet from 'promise-loader?global,websites!in-alerting/smart-alerts/websites/TearSheet/AlertConfigTearSheet';
import AnalyzeView2_0 from 'promise-loader?global,websites!in-websites/analyze/AnalyzeView2_0/AnalyzeView';
import NewWebsiteFlow from 'promise-loader?global,websites!in-websites/NewWebsiteFlow/NewWebsiteFlow';
import WebsitesList from 'promise-loader?global,websites!in-websites/WebsitesList/WebsitesList';
import { Route } from 'react-router-dom';
import React from 'react';

import {
  websitesPathFullyQualified,
  websiteMonitoringPath,
  websitePathFullyQualified,
  newWebsitePathFullyQualified,
  analyzePathFullyQualified,
  websiteSmartAlertsFullScreen
} from 'in-websites/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default [
  <Route key="websitesList" path={websitesPathFullyQualified}>
    {renderAsyncRouteChildren(WebsitesList)}
  </Route>,
  <Route key="websiteDashboard" path={websitePathFullyQualified}>
    {renderAsyncRouteChildren(WebsiteDashboard)}
  </Route>,
  <Route key="websiteNew" path={newWebsitePathFullyQualified}>
    {renderAsyncRouteChildren(NewWebsiteFlow)}
  </Route>,
  <Route key="websiteAnalyzeBeacons" path={analyzePathFullyQualified}>
    {renderAsyncRouteChildren(AnalyzeView2_0)}
  </Route>,
  <Route key="websiteFullScreenView" path={websiteSmartAlertsFullScreen}>
    {renderAsyncRouteChildren(AlertConfigTearSheet)}
  </Route>,
  <RedirectWithHash key="redirectToWebsitesList" from={websiteMonitoringPath} to={websitesPathFullyQualified} />
];
