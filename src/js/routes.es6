'use strict';

/*eslint-disable no-unused-vars*/
// While this variable seems unused, it is required after the JSX transpilation.
// As such React needs to be imported in order for the app to be fully
// functional.
import React from 'react';
/*eslint-enable no-unused-vars*/

import {Route} from 'react-router';

import App from './App';
import DetailPane from './DetailPane';

export default (
  <Route name='root' path='/' handler={App}>
    <Route handler={DetailPane}
           path='detail-pane/:pluginId/:hostId/:steadyId'
           name='detail-pane'/>
  </Route>
);
