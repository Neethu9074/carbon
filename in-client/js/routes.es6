/* eslint-disable no-unused-vars */
// While this variable seems unused, it is required after the JSX transpilation.
// As such React needs to be imported in order for the app to be fully
// functional.
import React from 'react';
/* eslint-enable no-unused-vars */

import {Route} from 'react-router';

import TraceView from 'in-components/trace/TraceView';

import App from './components/App';
import Dashboard from './components/Dashboard';

export default (
  <Route name='map' path='/' handler={App}>
    <Route handler={Dashboard}
           path='dashboard'
           name='dashboard'/>
    <Route handler={TraceView}
           path='traces'
           name='traces'/>
  </Route>
);
