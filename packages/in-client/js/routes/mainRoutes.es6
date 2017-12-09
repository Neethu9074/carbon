import { Switch, Route } from 'react-router-dom';
import React from 'react';

import ConfigurationView from 'promise-loader?global,configView!in-views/configurationView/ConfigurationView';
import NewWebsite from 'promise-loader?global,eumView!in-views/eumView/components/NewWebsite';
import { createViewComponent } from 'in-components/routing/createAsyncComponent';
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
    <Route path="/cockpit" component={Cockpit} />

    <Route path="/ascii/physical" component={AsciiMap} />
    <Route path="/ascii/logical" component={AsciiMap} />
    <Route path="/ascii/container" component={AsciiMap} />

    <Route path="/physical" component={Map} />
    <Route path="/logical" component={Map} />
    <Route path="/container" component={Map} />

    <Route component={createViewComponent(EventView)} path="/events" />

    <Route component={createViewComponent(TableView)} path="/table" />

    <Route component={createViewComponent(NewWebsite)} path="/website/new" />
    <Route component={createViewComponent(EumView)} path="/website" />

    <Route component={GraphView} path="/graph" />

    <Route path="/config" component={createViewComponent(ConfigurationView)} />

    <Route component={createViewComponent(TraceView)} path="/traces" />

    {role.canConfigureAgents ? (
      <Route path="/agents" component={createViewComponent(AgentView)} windowTitle="Instana Agents" />
    ) : null}

    {instanaInternalFeaturesEnabled ? (
      <Route path="/internal" component={createViewComponent(InternalViews)} windowTitle="Internal" />
    ) : null}

    <RedirectWithHash from="/" to="/physical" />
  </Switch>
);
