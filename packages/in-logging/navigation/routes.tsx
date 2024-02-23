/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

//@ts-expect-error
import SmartAlertDetailsView from 'promise-loader?global,logging!!in-alerting/smart-alerts/logs/details/AlertDetails';
//@ts-expect-error needs TS migration
import AnalyzeView from 'promise-loader?global,logging!in-logging/analyze/AnalyzeView/AnalyzeView';
//@ts-expect-error
import SmartAlertList from 'promise-loader?global,logging!in-alerting/smart-alerts/logs/Alerts';
import { Route } from 'react-router-dom';
import React from 'react';

//@ts-expect-error needs TS migration
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { logsPath, alertsFullyQualifiedPath } from 'in-logging/navigation/paths';
import CreateSmartAlert from 'in-alerting/smart-alerts/logs/CreateSmartAlert';
import { alertDetailsFullyQualifiedPath } from 'in-logging/navigation/paths';
import { role } from 'in-stores/user';

export default [
  <Route key="logsSmartAlertDetails" path={alertDetailsFullyQualifiedPath}>
    {renderAsyncRouteChildren(SmartAlertDetailsView)}
    {logsSmartAlertFloatingButton()}
  </Route>,
  <Route key="logsSmartAlertsList" path={alertsFullyQualifiedPath}>
    {renderAsyncRouteChildren(SmartAlertList)}
    {logsSmartAlertFloatingButton()}
  </Route>,
  <Route key="logsAnalyze" path={logsPath}>
    {renderAsyncRouteChildren(AnalyzeView)}
  </Route>
];

function logsSmartAlertFloatingButton() {
  return (
    role?.canConfigureGlobalLogSmartAlerts && (
      <FloatingActionButtons>
        <CreateSmartAlert />
      </FloatingActionButtons>
    )
  );
}
