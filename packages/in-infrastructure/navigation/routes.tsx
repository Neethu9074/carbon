/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

// @ts-expect-error module need to be translated to TS
import InfraExploreView from 'promise-loader?global,infrastructure!in-infrastructure/Explore/Explore';
// @ts-expect-error module need to be translated to TS
import TableView from 'promise-loader?global,infrastructure!in-infrastructure/tableView/TableView';
// @ts-expect-error module need to be translated to TS
import GraphView from 'promise-loader?global,graph-view!in-components/graphView/GraphView';
//@ts-expect-error
import SmartAlertView from 'promise-loader?global,infrastructure!in-infrastructure/smartAlertView/SmartAlertView';
// @ts-expect-error module need to be translated to TS
import Map from 'promise-loader?global,infrastructure!in-map/index';
import { Route } from 'react-router-dom';
import React from 'react';

// @ts-expect-error module need to be translated to TS
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import {
  containerPath,
  graphPath,
  physicalPath,
  tablePath,
  infraSmartAlerts
} from 'in-stores/navigation/paths/mainPaths';
// @ts-expect-error module need to be translated to TS
import { infraExplorePath } from 'in-infrastructure/navigation/paths';
import { hasInfrastructureAnalyzeAccess } from 'in-stores/permission';
import { infraSmartAlertsEnabled } from 'in-services/featureFlags';

const infrastructureRoutes = [
  <Route key="infraPhysical" path={physicalPath}>
    {renderAsyncRouteChildren(Map)}
  </Route>,
  infraSmartAlertsEnabled && (
    <Route key="infraSmartAlert" path={infraSmartAlerts}>
      {renderAsyncRouteChildren(SmartAlertView)}
    </Route>
  ),
  <Route key="infraContainer" path={containerPath}>
    {renderAsyncRouteChildren(Map)}
  </Route>,
  <Route key="infraTable" path={tablePath}>
    {renderAsyncRouteChildren(TableView)}
  </Route>,
  <Route key="infraGraph" path={graphPath}>
    renderAsyncRouteChildren{GraphView}
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
