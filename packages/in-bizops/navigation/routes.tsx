/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error module need to be translated to TS
import BusinessProcessesList from 'promise-loader?global,bizops!in-bizops/lists/businessProcess/BusinessProcessList';
// @ts-expect-error module need to be translated to TS
import BizActivitiesList from 'promise-loader?global,bizops!in-bizops/lists/BizActivitiesList';
// @ts-expect-error module need to be translated to TS
import SmartAlertsList from 'promise-loader?global,bizops!in-bizops/lists/SmartAlertsList';
// @ts-ignore
import BusinessActivitySummaryDashboard from 'promise-loader?global,bizops!in-bizops/dashboards/activity/BusinessActivitySummary';
// @ts-ignore
import BusinessProcessSummaryDashboard from 'promise-loader?global,bizops!in-bizops/dashboards/summary/BusinessProcessSummary';
// @ts-ignore
import AnalyzeView from 'promise-loader?global,bizops!in-bizops/analyze/AnalyzeView/AnalyzeView';
import { Route } from 'react-router-dom';
import React from 'react';

import {
  businessActivityDashboard,
  businessProcessDashboard,
  businessProcessPath,
  smartAlertsPath,
  activitiesPath,
  analyzePath
} from 'in-bizops/navigation/paths';
// @ts-expect-error module need to be translated to TS
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

export default [
  <Route key="BusinessProcessesList" exact path={businessProcessPath}>
    {renderAsyncRouteChildren(BusinessProcessesList)}
  </Route>,
  <Route key="BizActivitiesList" exact path={activitiesPath}>
    {renderAsyncRouteChildren(BizActivitiesList)}
  </Route>,
  <Route key="SmartAlertsList" exact path={smartAlertsPath}>
    {renderAsyncRouteChildren(SmartAlertsList)}
  </Route>,
  <Route key="BusinessActivityDashboard" path={businessActivityDashboard}>
    {renderAsyncRouteChildren(BusinessActivitySummaryDashboard)}
  </Route>,
  <Route key="businessProcessDashboard" path={businessProcessDashboard}>
    {renderAsyncRouteChildren(BusinessProcessSummaryDashboard)}
  </Route>,
  <Route key="bizopsAnalyze" path={analyzePath}>
    {renderAsyncRouteChildren(AnalyzeView)}
  </Route>
];
