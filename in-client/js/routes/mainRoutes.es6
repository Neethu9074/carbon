import { Switch } from 'react-router-dom';
import React from 'react';

import ConfigurationView from 'promise-loader?global,configView!in-views/configurationView/ConfigurationView';
import { createAsyncFullscreenOverlayViewComponent } from 'in-components/routing/createAsyncComponent';
import TraceViewTabs from 'promise-loader?global!in-views/traceViewTabs/TraceViewTabs';
import NewWebsite from 'promise-loader?global,eumView!in-views/eumView/components/NewWebsite';
import EumView from 'promise-loader?global,eumView!in-views/eumView/EumView';
import EventView from 'promise-loader?global!in-views/eventView/EventView';
import TableView from 'promise-loader?global!in-views/tableView/TableView';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import RouteWithTitle from 'in-components/Navigation/RouteWithTitle';
import LogView from 'promise-loader?global!in-views/logView/LogView';
import GraphView from 'in-components/graphView/GraphView';
import GlobeView from 'in-components/globeView/GlobeView';
import { eumViewEnabled } from 'in-services/featureFlags';
import TableTest from 'in-views/tableTest/TableTest';
import AgentView from 'in-views/agentView/AgentView';
import Cockpit from 'in-views/cockpit/Cockpit';
import AsciiMap from 'in-map/AsciiMap';
import Map from 'in-map/index';

export default (
  <Switch>
    <RouteWithTitle path="/cockpit" component={Cockpit} windowTitle="Cockpit" />
    <RouteWithTitle path="/tableTest" component={TableTest} windowTitle="Table Test" />

    <RouteWithTitle path="/ascii/physical" component={AsciiMap} windowTitle="Infrastructure Host Map" />
    <RouteWithTitle path="/ascii/logical" component={AsciiMap} windowTitle="Application Map" />
    <RouteWithTitle path="/ascii/container" component={AsciiMap} windowTitle="Infrastructure Container Map" />

    <RouteWithTitle path="/physical" component={Map} windowTitle="Infrastructure Host Map" />
    <RouteWithTitle path="/logical" component={Map} windowTitle="Application Map" />
    <RouteWithTitle path="/container" component={Map} windowTitle="Infrastructure Container Map" />

    <RouteWithTitle
      component={createAsyncFullscreenOverlayViewComponent(EventView)}
      path="/events"
      windowTitle="Events"
    />

    <RouteWithTitle
      path="/table"
      component={createAsyncFullscreenOverlayViewComponent(TableView)}
      windowTitle="Comparison Table"
    />

    <RouteWithTitle component={createAsyncFullscreenOverlayViewComponent(LogView)} path="/logs" windowTitle="Logs" />

    {eumViewEnabled
      ? <RouteWithTitle
          component={createAsyncFullscreenOverlayViewComponent(NewWebsite)}
          path="/website/new"
          windowTitle="New Website"
        />
      : null}
    {eumViewEnabled
      ? <RouteWithTitle
          component={createAsyncFullscreenOverlayViewComponent(EumView)}
          path="/website"
          windowTitle="Websites"
        />
      : null}

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

    <RouteWithTitle path="/agents" component={AgentView} windowTitle="Instana Agents" />

    <RedirectWithHash from="/" to="/physical" />
  </Switch>
);
