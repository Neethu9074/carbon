'use strict';

/*eslint-disable no-unused-vars*/
// While this variable seems unused, it is required after the JSX transpilation.
// As such React needs to be imported in order for the app to be fully
// functional.
import React from 'react';
/*eslint-enable no-unused-vars*/

import {Route} from 'react-router';

import App from './components/App';
import DetailPane from './components/DetailPane';
import SnapshotPane from './components/SnapshotPane';

export default (
  <Route name='map' path='/' handler={App}>
    <Route handler={DetailPane}
           path='detail-pane/:pluginId/:hostId/:steadyId'
           name='detail-pane'/>
    <Route handler={SnapshotPane}
           path='snapshot-pane/'
           name='snapshot-pane'/>
  </Route>
);
