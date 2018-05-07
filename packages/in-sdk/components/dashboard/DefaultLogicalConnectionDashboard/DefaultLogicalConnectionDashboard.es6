import React from 'react';

import DefaultKpiConnectionSection from 'in-sdk/components/dashboard/DefaultLogicalConnectionDashboard/DefaultKpiConnectionSection';
import DefaultConnectionCharts from 'in-sdk/components/dashboard/DefaultLogicalConnectionDashboard/DefaultConnectionCharts';
import ConnectedOutboundEntitiesTable from 'in-components/LogicalEntityTables/ConnectedOutboundEntitiesTable';
import ConnectedInboundEntitiesTable from 'in-components/LogicalEntityTables/ConnectedInboundEntitiesTable';

export default function DefaultLogicalConnectionDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <DefaultKpiConnectionSection snapshot={snapshot} />

      <DefaultConnectionCharts snapshot={snapshot} timeConfig={timeConfig} />

      <ConnectedInboundEntitiesTable snapshot={snapshot} timeConfig={timeConfig} />

      <ConnectedOutboundEntitiesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
