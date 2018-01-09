import { Switch, Route } from 'react-router-dom';
import React from 'react';

import {
  agentsPath,
  applicationsPath,
  asciiContainerPath,
  asciiLogicalPath,
  asciiPhysicalPath,
  cockpitPath,
  settingsPath,
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
import ConfigurationView from 'promise-loader?global,configView!in-views/configurationView/ConfigurationView';
import NewWebsite from 'promise-loader?global,eumView!in-views/eumView/components/NewWebsite';
import ApplicationView from 'promise-loader?global!in-views/applicationView/ApplicationView';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import EumView from 'promise-loader?global,eumView!in-views/eumView/EumView';
import TableView from 'promise-loader?global!in-views/tableView/TableView';
import AgentView from 'promise-loader?global!in-views/agentView/AgentView';
import EventView from 'promise-loader?global!in-views/eventView/EventView';
import TraceView from 'promise-loader?global!in-views/traceView/TraceView';
import { instanaInternalFeaturesEnabled } from 'in-services/featureFlags';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import InternalViews from 'promise-loader?global,internal!in-internal';
import GraphView from 'in-components/graphView/GraphView';
import Cockpit from 'in-views/cockpit/Cockpit';
import AsciiMap from 'in-map/AsciiMap';
import { role } from 'in-stores/user';
import Map from 'in-map/index';

export default (
  <Switch>
    <Route path={cockpitPath} component={Cockpit} />
    <Route path={asciiPhysicalPath} component={AsciiMap} />
    <Route path={asciiLogicalPath} component={AsciiMap} />
    <Route path={asciiContainerPath} component={AsciiMap} />
    <Route path={physicalPath} component={Map} />
    <Route path={logicalPath} component={Map} />
    <Route path={containerPath} component={Map} />

    <Route component={createAsyncViewComponent(EventView)} path={eventsPath} />
    <Route component={createAsyncViewComponent(TableView)} path={tablePath} />
    <Route component={createAsyncViewComponent(NewWebsite)} path={newWebsitePath} />
    <Route component={createAsyncViewComponent(EumView)} path={websitePath} />
    <Route component={GraphView} path={graphPath} />
    <Route component={createAsyncViewComponent(ConfigurationView)} path={settingsPath} />
    <Route component={createAsyncViewComponent(TraceView)} path={tracesPath} />
    {role.canConfigureAgents ? (
      <Route path={agentsPath} component={createAsyncViewComponent(AgentView)} windowTitle="Instana Agents" />
    ) : null}

    {instanaInternalFeaturesEnabled ? (
      <Route path="/internal" component={createAsyncViewComponent(InternalViews)} windowTitle="Internal" />
    ) : null}

    {/* landing page */}
    <RedirectWithHash from="/" to={physicalPath} />
  </Switch>
);
