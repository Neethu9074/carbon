// While this variable seems unused, it is required after the JSX transpilation.
// As such React needs to be imported in order for the app to be fully functional
import React from 'react';

import {Route} from 'react-router';

import TraceView from 'in-components/traceView/TraceView';
import TableView from 'in-components/tableView/TableView';

import Dashboard from './components/Dashboard';
import App from './components/App';

export default (
  <Route name='map' path='/' handler={App}>
    <Route handler={Dashboard}
           path='dashboard'
           name='dashboard'/>
    <Route handler={TraceView}
           path='traces'
           name='traces'/>
    <Route handler={TableView}
           path='table'
           name='table'/>
  </Route>
);
