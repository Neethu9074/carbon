import { Switch } from 'react-router-dom';
import React from 'react';

import ConfigurationView from 'promise-loader?global,configView!in-views/configurationView/ConfigurationView';
import { createAsyncFullscreenOverlayViewComponent } from 'in-components/routing/createAsyncComponent';
import KubernetesView from 'promise-loader?global,eumView!in-views/kubernetesView/KubernetesView';
import NewWebsite from 'promise-loader?global,eumView!in-views/eumView/components/NewWebsite';
import PhysicalTableView from 'promise-loader?global!in-views/tableView/PhysicalTableView';
import LogicalTableView from 'promise-loader?global!in-views/tableView/LogicalTableView';
import EumView from 'promise-loader?global,eumView!in-views/eumView/EumView';
import AgentView from 'promise-loader?global!in-views/agentView/AgentView';
import EventView from 'promise-loader?global!in-views/eventView/EventView';
import TraceView from 'promise-loader?global!in-views/traceView/TraceView';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
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

    <Route path="/table/physical" component={createAsyncFullscreenOverlayViewComponent(PhysicalTableView)} />
    <Route path="/table/logical" component={createAsyncFullscreenOverlayViewComponent(LogicalTableView)} />

    <Route component={createAsyncFullscreenOverlayViewComponent(NewWebsite)} path="/website/new" />
    <Route component={createAsyncFullscreenOverlayViewComponent(EumView)} path="/website" />
    <Route component={createAsyncFullscreenOverlayViewComponent(KubernetesView)} path="/kubernetes" />

    <Route component={GraphView} path="/graph" />
    <Route component={GlobeView} path="/globe" />

    <Route path="/config" component={createAsyncFullscreenOverlayViewComponent(ConfigurationView)} />

    <Route component={createAsyncFullscreenOverlayViewComponent(TraceView)} path="/traces" />

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
