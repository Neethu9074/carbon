/*global require:false*/



/*eslint-disable no-unused-vars*/
// While this variable seems unused, it is required after the JSX transpilation.
// As such React needs to be imported in order for the app to be fully
// functional.
import React from 'react';
/*eslint-enable no-unused-vars*/

import {Route} from 'react-router';

import App from './components/App';
import Dashboard from './components/Dashboard';
import SnapshotPane from './components/SnapshotPane';
import EnvironmentPane from './components/EnvironmentPane';
import MetricLatencyPane from './components/MetricLatencyPane';

const DogePane = require('./components/DogePane/index.djs');

export default (
  <Route name='map' path='/' handler={App}>
    <Route handler={Dashboard}
           path='dashboard/:pluginId/:hostId/:steadyId'
           name='dashboard'/>
    {__DEV__ ?
      <Route handler={SnapshotPane}
             path='internal/:env/:tenant/:unit/hosts'
             name='snapshot-pane'/>
    : null}
    {__DEV__ ?
      <Route handler={EnvironmentPane}
             path='internal/environments/'
             name='environments-pane'/>
    : null}
    {__DEV__ ?
      <Route handler={MetricLatencyPane}
             path='internal/:env/:tenant/:unit/:hostId/:pluginId/:steadyId/metrics'
						 name='metric-latency-pane'/>
    : null}
    <Route handler={DogePane}
           path='suchWow'
           name='suchWow' />
  </Route>
);
