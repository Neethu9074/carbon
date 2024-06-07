/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error module need to be translated to TS
import BusinessPerspectiveSummary from 'promise-loader?global,bizops!in-bizops/dashboards/perspectives/BusinessPerspectiveSummary';
// @ts-expect-error module need to be translated to TS
import BusinessPerspectivesList from 'promise-loader?global,bizops!in-bizops/lists/businessPerspectives/BusinessPerspectivesList';
// @ts-expect-error module need to be translated to TS
import BusinessProcessesList from 'promise-loader?global,bizops!in-bizops/lists/businessProcess/BusinessProcessList';
// @ts-expect-error
import BusinessActivitySummaryDashboard from 'promise-loader?global,bizops!in-bizops/dashboards/activity/BusinessActivitySummary';
//@ts-expect-error
import BusinessProcessSummaryDashboard from 'promise-loader?global,bizops!in-bizops/dashboards/summary/BusinessProcessSummary';
import { Route } from 'react-router-dom';
import React from 'react';

import {
  businessActivityDashboard,
  businessProcessDashboard,
  businessProcessPath,
  businessPerspectivesPath,
  businessPerspectiveDashboard
} from 'in-bizops/navigation/paths';
// @ts-expect-error module need to be translated to TS
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { bizopsPerspectivesEnabled } from 'in-services/featureFlags';

let routes = [
  <Route key="BusinessProcessesList" exact path={businessProcessPath}>
    {renderAsyncRouteChildren(BusinessProcessesList)}
  </Route>,
  <Route key="BusinessActivityDashboard" path={businessActivityDashboard}>
    {renderAsyncRouteChildren(BusinessActivitySummaryDashboard)}
  </Route>,
  <Route key="businessProcessDashboard" path={businessProcessDashboard}>
    {renderAsyncRouteChildren(BusinessProcessSummaryDashboard)}
  </Route>
];

if (bizopsPerspectivesEnabled) {
  routes.push(
    <Route key="BusinessPerspectivesList" exact path={businessPerspectivesPath}>
      {renderAsyncRouteChildren(BusinessPerspectivesList)}
    </Route>,
    <Route key="BusinessPerspectiveSummary" path={businessPerspectiveDashboard}>
      {renderAsyncRouteChildren(BusinessPerspectiveSummary)}
    </Route>
  );
}

export default routes;
