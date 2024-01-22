/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

// @ts-expect-error module need to be translated to TS
import InfraExploreView from 'promise-loader?global,infrastructure!in-infrastructure/Explore/Explore';
// @ts-expect-error module need to be translated to TS
import TableView from 'promise-loader?global,infrastructure!in-infrastructure/tableView/TableView';
//@ts-expect-error
import SmartAlertDetailsView from 'promise-loader?global,infrastructure!in-infrastructure/smartAlertView/AlertDetailsView';
//@ts-expect-error
import SmartAlertView from 'promise-loader?global,infrastructure!in-infrastructure/smartAlertView/SmartAlertView';
// @ts-expect-error module need to be translated to TS
import Map from 'promise-loader?global,infrastructure!in-map/index';
import { Route } from 'react-router-dom';
import React from 'react';

// @ts-expect-error module need to be translated to TS
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
// @ts-expect-error module need to be translated to TS
import { infraExplorePath } from 'in-infrastructure/navigation/paths';
import { containerPath, physicalPath, tablePath, infraSmartAlerts } from 'in-stores/navigation/paths/mainPaths';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { infraAlertDetailsFullyQualifiedPath } from 'in-stores/navigation/paths/mainPaths';
import CreateSmartAlert from 'in-alerting/smart-alerts/infrastructure/CreateSmartAlert';
import { hasInfrastructureAnalyzeAccess } from 'in-stores/permission';
import { infraSmartAlertsEnabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';

const infrastructureRoutes = [
  <Route key="infraPhysical" path={physicalPath}>
    {renderAsyncRouteChildren(Map)}
  </Route>,
  // Note: `infraAlertDetails` route needs to be added before `infraSmartAlert` route or else it will always display the SA list
  <Route key="infraAlertDetails" path={infraAlertDetailsFullyQualifiedPath}>
    {renderAsyncRouteChildren(SmartAlertDetailsView)}
    {infraSmartAlertFloatingButton()}
  </Route>,
  infraSmartAlertsEnabled && (
    <Route key="infraSmartAlert" path={infraSmartAlerts}>
      {renderAsyncRouteChildren(SmartAlertView)}
      {infraSmartAlertFloatingButton()}
    </Route>
  ),
  <Route key="infraContainer" path={containerPath}>
    {renderAsyncRouteChildren(Map)}
  </Route>,
  <Route key="infraTable" path={tablePath}>
    {renderAsyncRouteChildren(TableView)}
  </Route>
];
if (hasInfrastructureAnalyzeAccess) {
  infrastructureRoutes.push(
    <Route key="infraExplore" path={infraExplorePath}>
      {renderAsyncRouteChildren(InfraExploreView)}
    </Route>
  );
}

export default infrastructureRoutes;

function infraSmartAlertFloatingButton() {
  return (
    (role?.canConfigureGlobalInfraSmartAlerts ?? role?.canConfigureGlobalAlertConfigs) && (
      <FloatingActionButtons>
        <CreateSmartAlert />
      </FloatingActionButtons>
    )
  );
}
