import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [];

export default function ServiceEndpointTable(/*{ snapshot, timeframe }*/) {
  return (
    <DashboardSection title="Individual CPU Usage">
      <Table cols={cols} rows={[]} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(/*row*/) {
  return (
    <div>
      details here
    </div>
  );
}
