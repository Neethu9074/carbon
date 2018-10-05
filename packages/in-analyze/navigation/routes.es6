import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import CallsList from 'promise-loader?global,analyze!in-analyze/AnalyzeView';
import { analyze } from 'in-analyze/navigation/paths';

export default (
  <Fragment>
    <Route path={analyze} component={createAsyncViewComponent(CallsList)} />
  </Fragment>
);
