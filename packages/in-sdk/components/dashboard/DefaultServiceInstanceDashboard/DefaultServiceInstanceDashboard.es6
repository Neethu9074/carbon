import React from 'react';

import DefaultCharts from 'in-sdk/components/dashboard/DefaultServiceInstanceDashboard/DefaultServiceInstanceCharts';
import DefaultKpiSection from 'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultKpiSection';
import ClusterNodes from 'in-components/LogicalEntityTables/ClusterNodes';
import Connections from 'in-components/LogicalEntityTables/Connections';

export default function DefaultLogicalServiceDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <DefaultKpiSection snapshot={snapshot} />

      <DefaultCharts snapshot={snapshot} timeConfig={timeConfig} />

      <ClusterNodes snapshotId={snapshot.get('id')} timeConfig={timeConfig} />

      <Connections snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
    </div>
  );
}
