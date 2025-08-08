/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

const AlertConfigTearSheet = () =>
  import(
    /* webpackChunkName: "infrastructure" */ 'in-alerting/smart-alerts/infrastructure/tearsheet/AlertConfigTearSheet'
  );
const GraphExplorerView = () =>
  // @ts-expect-error file was not migrated to typescript
  import(/* webpackChunkName: "graph-explorer-view" */ 'in-infrastructure/GraphExplorer/GraphExplorer');
// @ts-expect-error file was not migrated to typescript
const InfraExploreView = () => import(/* webpackChunkName: "infrastructure" */ 'in-infrastructure/Explore/Explore');
const CustomEntitiesDashboardsPage = () =>
  import(/* webpackChunkName: "infrastructure" */ 'in-infrastructure/CustomEntity/CustomEntitiesDashboards');
const TableView = () => import(/* webpackChunkName: "infrastructure" */ 'in-infrastructure/tableView/TableView');
// @ts-expect-error file was not migrated to typescript
const GraphView = () => import(/* webpackChunkName: "graph-view" */ 'in-components/graphView/GraphView');
const SmartAlertDetailsView = () =>
  import(/* webpackChunkName: "infrastructure" */ 'in-infrastructure/smartAlertView/AlertDetailsView');
const SmartAlertView = () =>
  import(/* webpackChunkName: "infrastructure" */ 'in-infrastructure/smartAlertView/SmartAlertView');
// @ts-expect-error file was not migrated to typescript
const Map = () => import(/* webpackChunkName: "infrastructure" */ 'in-map/index');
import { Route } from 'react-router-dom';
import React from 'react';

import {
  containerPath,
  graphPath,
  graphExplorerPath,
  physicalPath,
  tablePath,
  infraSmartAlerts,
  infraSmartAlertsFullScreen
} from 'in-stores/navigation/paths/mainPaths';
import {
  infraSmartAlertsEnabled,
  infraSmartAlertDialogViewEnabled,
  infraSmartAlertFullScreenDesignEnabled
} from 'in-services/featureFlags';
// @ts-expect-error module need to be translated to TS
import { infraExplorePath, customEntitiesPath } from 'in-infrastructure/navigation/paths';
// @ts-expect-error module need to be translated to TS
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import { infraAlertDetailsFullyQualifiedPath } from 'in-stores/navigation/paths/mainPaths';
import { FULLSCREEN, CHOICE_DIALOG } from 'in-alerting/smart-alerts/data/constants';
// eslint-disable-next-line no-restricted-imports
import { Role } from 'in-types';

const alertDisplayMode = getSmartAlertDisplayMode(
  infraSmartAlertDialogViewEnabled,
  infraSmartAlertFullScreenDesignEnabled
);

const getInfrastructureRoutes = (role: Role, hasInfrastructureAnalyzeAccess?: boolean) => {
  const infrastructureRoutes = [
    <Route key="infraPhysical" path={physicalPath}>
      {renderAsyncRouteChildren(Map)}
    </Route>,
    // Note: `infraAlertDetails` route needs to be added before `infraSmartAlert` route or else it will always display the SA list
    <Route key="infraAlertDetails" path={infraAlertDetailsFullyQualifiedPath}>
      {renderAsyncRouteChildren(SmartAlertDetailsView)}
    </Route>,
    infraSmartAlertsEnabled && !role?.limitedInfrastructureScope && (
      <Route key="infraSmartAlert" path={infraSmartAlerts}>
        {renderAsyncRouteChildren(SmartAlertView)}
      </Route>
    ),
    (alertDisplayMode === FULLSCREEN || alertDisplayMode === CHOICE_DIALOG) && !role?.limitedInfrastructureScope && (
      <Route key="infraSmartAlert" path={infraSmartAlertsFullScreen}>
        {renderAsyncRouteChildren(AlertConfigTearSheet)}
      </Route>
    ),
    <Route key="infraContainer" path={containerPath}>
      {renderAsyncRouteChildren(Map)}
    </Route>,
    <Route key="infraTable" path={tablePath}>
      {renderAsyncRouteChildren(TableView)}
    </Route>,
    <Route key="infraGraph" path={graphPath}>
      {renderAsyncRouteChildren(GraphView)}
    </Route>,
    <Route key="infraGraphExplorer" path={graphExplorerPath}>
      {renderAsyncRouteChildren(GraphExplorerView)}
    </Route>
  ];
  if (hasInfrastructureAnalyzeAccess) {
    infrastructureRoutes.push(
      <Route key="customEntitiesInstances" path={`${customEntitiesPath}/dashboard`}>
        {renderAsyncRouteChildren(CustomEntitiesDashboardsPage)}
      </Route>,
      <Route key="infraExplore" path={infraExplorePath}>
        {renderAsyncRouteChildren(InfraExploreView)}
      </Route>
    );
  }
  return infrastructureRoutes;
};

export default getInfrastructureRoutes;
