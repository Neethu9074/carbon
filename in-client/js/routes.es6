// While this variable seems unused, it is required after the JSX transpilation.
// As such React needs to be imported in order for the app to be fully functional
import HttpServiceExtractionConfiguration
  from 'promise?global,configView!in-views/configurationView/subview/HttpServiceExtractionConfiguration';
import ConfigurationView from 'promise?global,configView!in-views/configurationView/ConfigurationView';
import UiConfig from 'promise?global,configView!in-views/configurationView/subview/UiConfig';
import {Route, Redirect, IndexRedirect} from 'react-router';
import React from 'react';

import {createAsyncFullscreenOverlayViewComponent} from 'in-components/routing/createAsyncComponent';
import GraphView from 'in-components/graphView/GraphView';
import GlobeView from 'in-components/globeView/GlobeView';
import WebVRView from 'in-components/webVRView/WebVRView';
import TableView from 'in-views/tableView/TableView';
import TraceView from 'in-views/traceView/TraceView';
import EventView from 'in-views/eventView/EventView';
import Dashboard from 'in-components/Dashboard';
import App from 'in-client/js/App';
import Map from 'in-map/index';

export default (
  <Route path='/'
         component={App}>
    <Route path='physical'
           component={Map}>
      <Route path='dashboard'
             component={Dashboard} />
    </Route>

    <Route path='logical'
           component={Map}>
      <Route path='dashboard'
             component={Dashboard} />
    </Route>

    <Route component={TraceView}
           path='traces'>
      <Route path='dashboard'
             component={Dashboard} />
    </Route>

    <Route component={EventView}
           path='events'>
      <Route component={Dashboard}
             path='dashboard' />
    </Route>

    <Route component={TableView}
           path='table'>
      <Route component={Dashboard}
             path='dashboard' />
    </Route>

    <Route path='config'
           component={createAsyncFullscreenOverlayViewComponent(ConfigurationView)}>
      <Route component={createAsyncFullscreenOverlayViewComponent(HttpServiceExtractionConfiguration)}
             path='httpServiceExtraction' />
      <Route component={createAsyncFullscreenOverlayViewComponent(UiConfig)}
             path='userInterface' />

    </Route>

    <Route component={GraphView}
           path='graph' />
    <Route component={GlobeView}
           path='globe' />
    <Route component={WebVRView}
           path='webVR/physical' />
    <Route component={WebVRView}
           path='webVR/logical' />

    {/* Legacy routes */}
    <Redirect from='dashboard' to='physical/dashboard' />
    <IndexRedirect to='/physical' />
  </Route>
);
