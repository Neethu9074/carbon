import React from 'react';

import ApplicationsTable from 'in-forge/plugins/mule/Dashboard/ApplicationsTable.es6';
import FlowsTable from 'in-forge/plugins/mule/Dashboard/FlowsTable.es6';

export default function MuleDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <ApplicationsTable snapshot={snapshot} timeConfig={timeConfig} />
      <FlowsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
