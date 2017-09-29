import React from 'react';

import ApplicationsTable from 'in-forge/plugins/mule/Dashboard/ApplicationsTable.es6';
import FlowsTable from 'in-forge/plugins/mule/Dashboard/FlowsTable.es6';

export default function MuleDashboard({ snapshot, timeframe }) {
  return (
    <div>
      <ApplicationsTable snapshot={snapshot} timeframe={timeframe} />
      <FlowsTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
