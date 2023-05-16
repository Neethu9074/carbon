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
// @ts-expect-error module need to be translated to TS
import Map from 'promise-loader?global,infrastructure!in-map/index';
import { Route } from 'react-router-dom';
import React from 'react';

// @ts-expect-error module need to be translated to TS
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
// @ts-expect-error module need to be translated to TS
import { infraExplorePath } from 'in-infrastructure/navigation/paths';
import { containerPath, graphPath, physicalPath, tablePath } from 'in-stores/navigation/paths/mainPaths';
import { hasInfrastructureAnalyzeAccess } from 'in-stores/permission';

const infrastructureRoutes = [
  <Route key="infraPhysical" path={physicalPath} children={renderAsyncRouteChildren(Map)} />,
  <Route key="infraContainer" path={containerPath} children={renderAsyncRouteChildren(Map)} />,
  <Route key="infraTable" path={tablePath} children={renderAsyncRouteChildren(TableView)} />,
  <Route key="infraGraph" path={graphPath} children={renderAsyncRouteChildren(GraphView)} />
];
if (hasInfrastructureAnalyzeAccess) {
  infrastructureRoutes.push(
    <Route key="infraExplore" path={infraExplorePath} children={renderAsyncRouteChildren(InfraExploreView)} />
  );
}

export default infrastructureRoutes;
