// While this variable seems unused, it is required after the JSX transpilation.
// As such React needs to be imported in order for the app to be fully functional
import React from 'react';

import {Route} from 'react-router';

import TraceView from 'in-components/traceView/TraceView';

import App from './components/App';
import Dashboard from './components/Dashboard';

export default (
  <Route path='/' component={App}>
    <Route component={Dashboard}
           path='dashboard' />
    <Route component={TraceView}
           path='traces' />
  </Route>
);
