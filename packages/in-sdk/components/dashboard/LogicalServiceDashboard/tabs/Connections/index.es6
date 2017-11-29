import { Switch, Route } from 'react-router-dom';
import React from 'react';

import ConnectionOverview from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Connections/ConnectionOverview';
import ConnectionSummary from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Connections/ConnectionSummary';

export default function Connections({ snapshot, timeframe }) {
  return (
    <Switch>
      <Route
        path={`*/dashboard/connections/:connectionId`}
        render={({ match }) => {
          return <ConnectionSummary snapshotId={match.params.connectionId} timeframe={timeframe} />;
        }}
      />
      <Route
        path={`*/dashboard*`}
        render={() => {
          return <ConnectionOverview snapshot={snapshot} timeframe={timeframe} />;
        }}
      />
    </Switch>
  );
}
