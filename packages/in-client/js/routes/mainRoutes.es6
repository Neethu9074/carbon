import { Route } from 'react-router-dom';
import React from 'react';

import {
  agentsPath,
  cockpitPath,
  containerPath,
  eventsPath,
  graphPath,
  logicalPath,
  physicalPath,
  tablePath,
  tracesPath,
  websitePath,
  newWebsitePath
} from 'in-stores/navigation/paths/mainPaths';
import {
  kubernetesEnabled,
  twoZeroModeEnabled,
  instanaInternalFeaturesEnabled,
  oneZeroWebsiteMonitoringEnabled,
  twoZeroWebsiteMonitoringEnabled
} from 'in-services/featureFlags';
import NewWebsite from 'promise-loader?global,eumView!in-views/eumView/components/NewWebsite';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import GraphView from 'promise-loader?global!in-components/graphView/GraphView';
import FragmentSupportingSwitch from 'in-components/FragmentSupportingSwitch';
import EumView from 'promise-loader?global,eumView!in-views/eumView/EumView';
import TableView from 'promise-loader?global!in-views/tableView/TableView';
import AgentView from 'promise-loader?global!in-views/agentView/AgentView';
import EventView from 'promise-loader?global!in-views/eventView/EventView';
import TraceView from 'promise-loader?global!in-views/traceView/TraceView';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import InternalViews from 'promise-loader?global,internal!in-internal';
import websiteMonitoringRoutes from 'in-websites/navigation/routes';
import applicationRoutes from 'in-applications/navigation/routes';
import configurationRoutes from 'in-settings/navigation/routes';
import kubernetesRoutes from 'in-kubernetes/navigation/routes';
import analyzeRoutes from 'in-analyze/navigation/routes';
import Cockpit from 'in-views/cockpit/Cockpit';
import { role } from 'in-stores/user';
import Map from 'in-map/index';

export default (
  <FragmentSupportingSwitch>
    <Route path={cockpitPath} component={Cockpit} />
    <Route path={physicalPath} component={Map} />
    {!twoZeroModeEnabled && <Route path={logicalPath} component={Map} />}
    <Route path={containerPath} component={Map} />

    <Route component={createAsyncViewComponent(EventView)} path={eventsPath} />
    <Route component={createAsyncViewComponent(TableView)} path={tablePath} />
    {oneZeroWebsiteMonitoringEnabled && (
      <Route component={createAsyncViewComponent(NewWebsite)} path={newWebsitePath} />
    )}
    {oneZeroWebsiteMonitoringEnabled && <Route component={createAsyncViewComponent(EumView)} path={websitePath} />}

    <Route component={createAsyncViewComponent(GraphView)} path={graphPath} />

    {configurationRoutes}

    <Route component={createAsyncViewComponent(TraceView)} path={tracesPath} />
    {role.canConfigureAgents && (
      <Route path={agentsPath} component={createAsyncViewComponent(AgentView)} windowTitle="Instana Agents" />
    )}

    {instanaInternalFeaturesEnabled && (
      <Route path="/internal" component={createAsyncViewComponent(InternalViews)} windowTitle="Internal" />
    )}

    {twoZeroModeEnabled && applicationRoutes}
    {twoZeroModeEnabled && analyzeRoutes}
    {kubernetesEnabled && kubernetesRoutes}
    {twoZeroWebsiteMonitoringEnabled && websiteMonitoringRoutes}

    {/* landing page */}
    <RedirectWithHash from="/" to={physicalPath} />
  </FragmentSupportingSwitch>
);
