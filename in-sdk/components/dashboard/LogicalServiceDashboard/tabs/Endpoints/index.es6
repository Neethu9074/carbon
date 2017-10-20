import { Switch, Route } from 'react-router-dom';
import React from 'react';

import EndpointOverview from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Endpoints/EndpointOverview';
import EndpointSummary from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Endpoints/EndpointSummary';

export default function Endpoints({ snapshot, timeframe }) {
  return (
    <Switch>
      <Route
        path={`*/dashboard/endpoints/:endpointId`}
        render={({ match }) => {
          return <EndpointSummary snapshot={snapshot} endpointId={match.params.endpointId} timeframe={timeframe} />;
        }}
      />
      <Route
        path={`*/dashboard*`}
        render={() => {
          return <EndpointOverview snapshot={snapshot} timeframe={timeframe} />;
        }}
      />
    </Switch>
  );
}
