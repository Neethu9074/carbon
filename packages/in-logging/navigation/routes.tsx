/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

//@ts-expect-error needs TS migration
import AnalyzeView from 'promise-loader?global,logging!in-logging/analyze/AnalyzeView/AnalyzeView';
//@ts-expect-error
import SmartAlertList from 'promise-loader?global,logging!in-alerting/smart-alerts/logs/Alerts';
import { Route } from 'react-router-dom';
import React from 'react';

//@ts-expect-error needs TS migration
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { logsPath, alertsFullyQualifiedPath } from 'in-logging/navigation/paths';

export default [
  <Route key="logsSmartAlertsList" path={alertsFullyQualifiedPath}>
    {renderAsyncRouteChildren(SmartAlertList)}
  </Route>,
  <Route key="logsAnalyze" path={logsPath}>
    {renderAsyncRouteChildren(AnalyzeView)}
  </Route>
];
