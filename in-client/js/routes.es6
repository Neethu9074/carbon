// While this variable seems unused, it is required after the JSX transpilation.
// As such React needs to be imported in order for the app to be fully functional
import {Route, Redirect, IndexRedirect} from 'react-router';
import React from 'react';

import TraceView from 'in-components/traceView/TraceView';
import EventView from 'in-components/eventView/EventView';
import GraphView from 'in-components/graphView/GraphView';
import WebVRView from 'in-components/webVRView/WebVRView';
import {isInternalEnvironment} from 'in-services/config';
import Dashboard from 'in-components/Dashboard';
import NoopRoute from 'in-client/js/NoopRoute';
import App from 'in-client/js/App';

export default (
  <Route path='/'
         component={App}>
    <Route path='physical'
           component={NoopRoute}
           showMap={true} />
    <Route path='physical/dashboard'
           component={Dashboard} />

    <Route path='logical'
           component={NoopRoute}
           showMap={true} />
    <Route path='logical/dashboard'
           component={Dashboard} />

    <Route component={TraceView}
           path='traces' />
    <Route path='traces/dashboard'
           component={Dashboard} />

    {isInternalEnvironment()
      ? <Route component={EventView}
               path='incidents' />
      : null}

    {isInternalEnvironment()
      ? <Route component={EventView}
               path='incidents/dashboard' />
      : null}

    <Route component={GraphView}
           path='graph' />

    <Route component={WebVRView}
           path='webVR' />

    {/* Legacy routes */}
    <Redirect from='dashboard' to='physical/dashboard' />
    <IndexRedirect to='/physical' />
  </Route>
);
