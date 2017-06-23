import React from 'react';

import { createAsyncComponentWithLoadingIndicatorPlaceholder } from 'in-components/routing/createAsyncComponent';
import TraceAnalyticsView from 'promise-loader?global!in-views/traceAnalyticsView/TraceAnalyticsView';
import TraceView from 'promise-loader?global!in-views/traceView/TraceView';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import RouteWithTitle from 'in-components/Navigation/RouteWithTitle';
import { traceAnalyticsEnabled } from 'in-services/featureFlags';
import { Switch } from 'react-router-dom';

export default (
  <Switch>
    <RedirectWithHash from="/traces/dashboard" to="/traces/search/dashboard" />

    <RouteWithTitle
      path="/traces/search"
      component={createAsyncComponentWithLoadingIndicatorPlaceholder(TraceView)}
      windowTitle="Traces"
    />

    {traceAnalyticsEnabled
      ? <RouteWithTitle
          path="/traces/analytics"
          component={createAsyncComponentWithLoadingIndicatorPlaceholder(TraceAnalyticsView)}
          windowTitle="Trace Analytics"
        />
      : null}

  </Switch>
);
