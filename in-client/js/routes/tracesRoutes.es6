import React from 'react';

import { createAsyncComponentWithLoadingIndicatorPlaceholder } from 'in-components/routing/createAsyncComponent';
import TraceView from 'promise-loader?global!in-views/traceView/TraceView';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';

export default (
  <Switch>
    <RedirectWithHash push={false} from="/traces/dashboard" to="/traces/search/dashboard" />

    <Route path="/traces/search" component={createAsyncComponentWithLoadingIndicatorPlaceholder(TraceView)} />
  </Switch>
);
