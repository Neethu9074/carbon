/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error module need to be translated to TS
import BizActivitiesList from 'promise-loader?global,bizops!in-bizops/lists/BizActivitiesList';
// @ts-expect-error module need to be translated to TS
import BusinessProcessesList from 'promise-loader?global,bizops!in-bizops/lists/BizOpsList';
// @ts-expect-error module need to be translated to TS
import SmartAlertsList from 'promise-loader?global,bizops!in-bizops/lists/SmartAlertsList';
// @ts-expect-error module need to be translated to TS
import { Route } from 'react-router-dom';
import React from 'react';

// @ts-expect-error module need to be translated to TS
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { smartAlertsPath } from 'in-bizops/navigation/paths';
import { activitiesPath } from 'in-bizops/navigation/paths';
import { bizOpsPath } from 'in-bizops/navigation/paths';

export default [
  <Route key="BusinessProcessesList" exact path={bizOpsPath}>
    {renderAsyncRouteChildren(BusinessProcessesList)}
  </Route>,
  <Route key="BizActivitiesList" exact path={activitiesPath}>
    {renderAsyncRouteChildren(BizActivitiesList)}
  </Route>,
  <Route key="SmartAlertsList" exact path={smartAlertsPath}>
    {renderAsyncRouteChildren(SmartAlertsList)}
  </Route>
];
