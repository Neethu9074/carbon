import irpt from 'react-immutable-proptypes';
import React from 'react';

import ServiceEndpointTable from 'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/ServiceEndpointTable';
import DefaultKpiSection from 'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultKpiSection';
import DefaultCharts from 'in-sdk/components/dashboard/DefaultLogicalServiceDashboard/DefaultCharts';
import ClusterNodes from 'in-components/LogicalEntityTables/ClusterNodes';
import Connections from 'in-components/LogicalEntityTables/Connections';
import { timeframeShape } from 'in-stores/timeline';

export default function DefaultLogicalServiceDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DefaultKpiSection snapshot={snapshot} />

      <DefaultCharts snapshot={snapshot} timeframe={timeframe} />

      <ClusterNodes snapshotId={snapshotId} timeframe={timeframe} />

      <ServiceEndpointTable snapshot={snapshot} timeframe={timeframe} />

      <Connections snapshotId={snapshotId} timeframe={timeframe} />
    </div>
  );
}

DefaultLogicalServiceDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
