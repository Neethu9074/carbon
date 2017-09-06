import { Switch } from 'react-router-dom';
import React from 'react';

import ConfigurationView from 'promise-loader?global,configView!in-views/configurationView/ConfigurationView';
import { createAsyncFullscreenOverlayViewComponent } from 'in-components/routing/createAsyncComponent';
import NewWebsite from 'promise-loader?global,eumView!in-views/eumView/components/NewWebsite';
import TraceViewTabs from 'promise-loader?global!in-views/traceViewTabs/TraceViewTabs';
import AgentView from 'promise-loader?global,eumView!in-views/agentView/AgentView';
import EumView from 'promise-loader?global,eumView!in-views/eumView/EumView';
import EventView from 'promise-loader?global!in-views/eventView/EventView';
import TableView from 'promise-loader?global!in-views/tableView/TableView';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import RouteWithTitle from 'in-components/Navigation/RouteWithTitle';
import { Route } from 'react-router-dom';
import LogView from 'promise-loader?global!in-views/logView/LogView';
import GraphView from 'in-components/graphView/GraphView';
import GlobeView from 'in-components/globeView/GlobeView';
import TableTest from 'in-views/tableTest/TableTest';
import Cockpit from 'in-views/cockpit/Cockpit';
import AsciiMap from 'in-map/AsciiMap';
import { role } from 'in-stores/user';
import Map from 'in-map/index';

export default (
  <Switch>
    <RouteWithTitle path="/cockpit" component={Cockpit} windowTitle="Cockpit" />
    <RouteWithTitle path="/tableTest" component={TableTest} windowTitle="Table Test" />

    <Route path="/ascii/physical" component={AsciiMap} windowTitle="Infrastructure Host Map" />
    <Route path="/ascii/logical" component={AsciiMap} windowTitle="Application Map" />
    <Route path="/ascii/container" component={AsciiMap} windowTitle="Infrastructure Container Map" />

    <Route path="/physical" component={Map} />
    <Route path="/logical" component={Map} />
    <Route path="/container" component={Map} />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(EventView)}
      path="/events"
      windowTitle="Events"
    />

    <Route
      path="/table"
      component={createAsyncFullscreenOverlayViewComponent(TableView)}
      windowTitle="Comparison Table"
    />

    <RouteWithTitle component={createAsyncFullscreenOverlayViewComponent(LogView)} path="/logs" windowTitle="Logs" />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(NewWebsite)}
      path="/website/new"
      windowTitle="New Website"
    />
    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(EumView)}
      path="/website"
      windowTitle="Websites"
    />

    <RouteWithTitle component={GraphView} path="/graph" windowTitle="Graph" />
    <RouteWithTitle component={GlobeView} path="/globe" windowTitle="World Globe" />

    <RouteWithTitle
      path="/config"
      component={createAsyncFullscreenOverlayViewComponent(ConfigurationView)}
      windowTitle="Settings"
    />

    <RouteWithTitle
      windowTitle="Traces"
      component={createAsyncFullscreenOverlayViewComponent(TraceViewTabs)}
      path="/traces"
    />

    {role.canConfigureAgents
      ? <RouteWithTitle
          path="/agents"
          component={createAsyncFullscreenOverlayViewComponent(AgentView)}
          windowTitle="Instana Agents"
        />
      : null}

    <RedirectWithHash from="/" to="/physical" />
  </Switch>
);
