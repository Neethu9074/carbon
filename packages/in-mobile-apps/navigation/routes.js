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
import React, { Fragment } from 'react';

import {
  mobileAppsPathFullyQualified,
  mobileAppMonitoringPath,
  mobileAppPathFullyQualified,
  newMobileAppPathFullyQualified,
  analyzePathFullyQualified
} from 'in-mobile-apps/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default (
  <Fragment>
    <Route path={mobileAppsPathFullyQualified} component={createAsyncViewComponent(MobileAppsList)} />
    <Route path={newMobileAppPathFullyQualified} component={createAsyncViewComponent(NewMobileAppFlow)} />
    <Route path={mobileAppPathFullyQualified} component={createAsyncViewComponent(MobileAppDashboard)} />
    <Route path={analyzePathFullyQualified} component={createAsyncViewComponent(AnalyzeView2_0)} />
    <RedirectWithHash from={mobileAppMonitoringPath} to={mobileAppsPathFullyQualified} />
  </Fragment>
);
