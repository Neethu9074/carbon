import { Switch } from 'react-router-dom';
import React from 'react';

import ConfigurationView from 'promise-loader?global,configView!in-views/configurationView/ConfigurationView';
import { createAsyncFullscreenOverlayViewComponent } from 'in-components/routing/createAsyncComponent';
import KubernetesView from 'promise-loader?global,eumView!in-views/kubernetesView/KubernetesView';
import NewWebsite from 'promise-loader?global,eumView!in-views/eumView/components/NewWebsite';
import TraceViewTabs from 'promise-loader?global!in-views/traceViewTabs/TraceViewTabs';
import EumView from 'promise-loader?global,eumView!in-views/eumView/EumView';
import AgentView from 'promise-loader?global!in-views/agentView/AgentView';
import EventView from 'promise-loader?global!in-views/eventView/EventView';
import TableView from 'promise-loader?global!in-views/tableView/TableView';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import LogView from 'promise-loader?global!in-views/logView/LogView';
import GraphView from 'in-components/graphView/GraphView';
import GlobeView from 'in-components/globeView/GlobeView';
import Cockpit from 'in-views/cockpit/Cockpit';
import { Route } from 'react-router-dom';
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

    <Route component={createAsyncFullscreenOverlayViewComponent(EventView)} path="/events" />

    <Route path="/table" component={createAsyncFullscreenOverlayViewComponent(TableView)} />

    <Route component={createAsyncFullscreenOverlayViewComponent(LogView)} path="/logs" />

    <Route component={createAsyncFullscreenOverlayViewComponent(NewWebsite)} path="/website/new" />
    <Route component={createAsyncFullscreenOverlayViewComponent(EumView)} path="/website" />
    <Route component={createAsyncFullscreenOverlayViewComponent(KubernetesView)} path="/kubernetes" />

    <Route component={GraphView} path="/graph" />
    <Route component={GlobeView} path="/globe" />

    <Route path="/config" component={createAsyncFullscreenOverlayViewComponent(ConfigurationView)} />

    <Route component={createAsyncFullscreenOverlayViewComponent(TraceViewTabs)} path="/traces" />

    {role.canConfigureAgents ? (
      <Route
        path="/agents"
        component={createAsyncFullscreenOverlayViewComponent(AgentView)}
        windowTitle="Instana Agents"
      />
    ) : null}

    <RedirectWithHash from="/" to="/physical" />
  </Switch>
);
