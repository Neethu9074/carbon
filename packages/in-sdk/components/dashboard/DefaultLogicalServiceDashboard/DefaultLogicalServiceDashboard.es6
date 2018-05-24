import React from 'react';

import ServiceEndpointTable from 'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/ServiceEndpointTable';
import DefaultKpiSection from 'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultKpiSection';
import DefaultCharts from 'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultCharts';
import ClusterNodes from 'in-components/LogicalEntityTables/ClusterNodes';
import Connections from 'in-components/LogicalEntityTables/Connections';

export default function DefaultLogicalServiceDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DefaultKpiSection snapshot={snapshot} />

      <DefaultCharts snapshot={snapshot} timeConfig={timeConfig} />

      <ClusterNodes snapshotId={snapshotId} timeConfig={timeConfig} />

      <ServiceEndpointTable snapshot={snapshot} timeConfig={timeConfig} />

      <Connections snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
