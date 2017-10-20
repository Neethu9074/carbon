import { Switch, Route } from 'react-router-dom';
import React from 'react';

import ServiceInstanceOverview from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/ServiceInstances/ServiceInstanceOverview';
import ServiceInstanceSummary from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/ServiceInstances/ServiceInstanceSummary';

export default function ServiceInstances({ snapshot, timeframe }) {
  return (
    <Switch>
      <Route
        path={`*/dashboard/serviceInstances/:serviceInstanceId`}
        render={({ match }) => {
          return <ServiceInstanceSummary serviceInstanceId={match.params.serviceInstanceId} timeframe={timeframe} />;
        }}
      />
      <Route
        path={`*/dashboard*`}
        render={() => {
          return <ServiceInstanceOverview snapshot={snapshot} timeframe={timeframe} />;
        }}
      />
    </Switch>
  );
}
