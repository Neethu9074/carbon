/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// all the lazy loaded views. Bundle name: websites
import WebsiteDashboard from 'promise-loader?global,websites!in-websites/WebsiteDashboard/WebsiteDashboard';
import AnalyzeView2_0 from 'promise-loader?global,websites!in-websites/analyze/AnalyzeView2_0/AnalyzeView';
import NewWebsiteFlow from 'promise-loader?global,websites!in-websites/NewWebsiteFlow/NewWebsiteFlow';
import AnalyzeView from 'promise-loader?global,websites!in-websites/analyze/AnalyzeView/AnalyzeView';
import WebsitesList from 'promise-loader?global,websites!in-websites/WebsitesList/WebsitesList';
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import {
  websitesPathFullyQualified,
  websiteMonitoringPath,
  websitePathFullyQualified,
  newWebsitePathFullyQualified,
  analyzePathFullyQualified
} from 'in-websites/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { webMobileQb2AnalyzeEnabled } from 'in-services/featureFlags';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default (
  <Fragment>
    <Route path={websitesPathFullyQualified} component={createAsyncViewComponent(WebsitesList)} />
    <Route path={websitePathFullyQualified} component={createAsyncViewComponent(WebsiteDashboard)} />
    <Route path={newWebsitePathFullyQualified} component={createAsyncViewComponent(NewWebsiteFlow)} />
    <Route
      path={analyzePathFullyQualified}
      component={createAsyncViewComponent(webMobileQb2AnalyzeEnabled ? AnalyzeView2_0 : AnalyzeView)}
    />
    <RedirectWithHash from={websiteMonitoringPath} to={websitesPathFullyQualified} />
  </Fragment>
);
