/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import {
  mobileAppsPathFullyQualified,
  mobileAppMonitoringPath,
  mobileAppPathFullyQualified,
  newMobileAppPathFullyQualified,
  analyzePathFullyQualified
} from 'in-mobile-apps/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { webMobileQb2AnalyzeEnabled } from 'in-services/featureFlags';
import RedirectWithHash from 'in-components/RedirectWithHash';

// all the lazy loaded views. Bundle name: mobileApps
import MobileAppDashboard from 'promise-loader?global,mobileApps!in-mobile-apps/MobileAppDashboard/MobileAppDashboard';
import NewMobileAppFlow from 'promise-loader?global,mobileApps!in-mobile-apps/NewMobileAppFlow/NewMobileAppFlow';
import AnalyzeView from 'promise-loader?global,mobileApps!in-mobile-apps/analyze/AnalyzeView/AnalyzeView';
import AnalyzeView2_0 from 'promise-loader?global,mobileApps!in-mobile-apps/analyze/AnalyzeView2_0/AnalyzeView';
import MobileAppsList from 'promise-loader?global,mobileApps!in-mobile-apps/MobileAppsList/MobileAppsList';

export default (
  <Fragment>
    <Route path={mobileAppsPathFullyQualified} component={createAsyncViewComponent(MobileAppsList)} />
    <Route path={newMobileAppPathFullyQualified} component={createAsyncViewComponent(NewMobileAppFlow)} />
    <Route path={mobileAppPathFullyQualified} component={createAsyncViewComponent(MobileAppDashboard)} />
    <Route
      path={analyzePathFullyQualified}
      component={createAsyncViewComponent(webMobileQb2AnalyzeEnabled ? AnalyzeView2_0 : AnalyzeView)}
    />
    <RedirectWithHash from={mobileAppMonitoringPath} to={mobileAppsPathFullyQualified} />
  </Fragment>
);
