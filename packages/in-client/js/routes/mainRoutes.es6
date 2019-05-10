import { Route, Redirect } from 'react-router-dom';
import React from 'react';

import {
  agentsPath,
  containerPath,
  eventsPath,
  graphPath,
  physicalPath,
  tablePath
} from 'in-stores/navigation/paths/mainPaths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import GraphView from 'promise-loader?global!in-components/graphView/GraphView';
import FragmentSupportingSwitch from 'in-components/FragmentSupportingSwitch';
import TableView from 'promise-loader?global!in-views/tableView/TableView';
import AgentView from 'promise-loader?global!in-views/agentView/AgentView';
import EventView from 'promise-loader?global!in-views/eventView/EventView';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import InternalViews from 'promise-loader?global,internal!in-internal';
import { role, isInstanaEmail, hasPermission } from 'in-stores/user';
import websiteMonitoringRoutes from 'in-websites/navigation/routes';
import applicationRoutes from 'in-applications/navigation/routes';
import configurationRoutes from 'in-settings/navigation/routes';
import kubernetesRoutes from 'in-kubernetes/navigation/routes';
import { kubernetesEnabled } from 'in-services/featureFlags';
import analyzeRoutes from 'in-analyze/navigation/routes';
import Map from 'in-map/index';

export default (
  <FragmentSupportingSwitch>
    <Route path={physicalPath} component={Map} />
    <Route path={containerPath} component={Map} />

    <Route component={createAsyncViewComponent(EventView)} path={eventsPath} />
    <Route component={createAsyncViewComponent(TableView)} path={tablePath} />
    <Route component={createAsyncViewComponent(GraphView)} path={graphPath} />

    {configurationRoutes}

    {role.canConfigureAgents && (
      <Route path={agentsPath} component={createAsyncViewComponent(AgentView)} windowTitle="Instana Agents" />
    )}

    {isInstanaEmail && (
      <Route path="/internal" component={createAsyncViewComponent(InternalViews)} windowTitle="Internal" />
    )}

    {applicationRoutes}
    {analyzeRoutes}
    {kubernetesEnabled && hasPermission('ACCESS_KUBERNETES') && kubernetesRoutes}
    {hasPermission('ACCESS_WEBSITES') && websiteMonitoringRoutes}

    {/* landing page */}
    <Redirect path="/cockpit" to="/internal/thisUnit/entityStatistics" />
    <RedirectWithHash from="/" to={physicalPath} />
  </FragmentSupportingSwitch>
);
