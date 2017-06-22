import ConfigurationView from 'promise-loader?global,configView!in-views/configurationView/ConfigurationView';

import TraceViewTabs from 'promise-loader?global!in-views/traceViewTabs/TraceViewTabs';
import { eumViewEnabled } from 'in-services/featureFlags';
import EventView from 'promise-loader?global!in-views/eventView/EventView';
import TableView from 'promise-loader?global!in-views/tableView/TableView';
import LogView from 'promise-loader?global!in-views/logView/LogView';
import EumView from 'promise-loader?global!in-views/eumView/EumView';
import { Switch } from 'react-router-dom';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import RouteWithTitle from 'in-components/Navigation/RouteWithTitle';

import TableTest from 'in-views/tableTest/TableTest';
import React from 'react';

import { createAsyncFullscreenOverlayViewComponent } from 'in-components/routing/createAsyncComponent';
import GraphView from 'in-components/graphView/GraphView';
import GlobeView from 'in-components/globeView/GlobeView';
import WebVRView from 'in-components/webVRView/WebVRView';
import Cockpit from 'in-views/cockpit/Cockpit';
import Map from 'in-map/index';

export default (
  <Switch>

    <RouteWithTitle path="/cockpit" component={Cockpit} windowTitle="Cockpit" />
    <RouteWithTitle path="/tableTest" component={TableTest} windowTitle="Table Test" />

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
      ? <RouteWithTitle component={createAsyncFullscreenOverlayViewComponent(EumView)} path="/eum" windowTitle="Eum" />
      : null}

    <RouteWithTitle component={GraphView} path="/graph" windowTitle="Graph" />
    <RouteWithTitle component={GlobeView} path="/globe" windowTitle="World Globe" />
    <RouteWithTitle component={WebVRView} path="/webVR/physical" windowTitle="Physical WebVR View" />
    <RouteWithTitle component={WebVRView} path="/webVR/logical" windowTitle="Logical WebVR View" />

    <RouteWithTitle
      path="/config"
      component={createAsyncFullscreenOverlayViewComponent(ConfigurationView)}
      windowTitle="Settings"
    />

    <RouteWithTitle component={createAsyncFullscreenOverlayViewComponent(TraceViewTabs)} path="/traces" />

    <RedirectWithHash from="/" to="/physical" />
  </Switch>
);
