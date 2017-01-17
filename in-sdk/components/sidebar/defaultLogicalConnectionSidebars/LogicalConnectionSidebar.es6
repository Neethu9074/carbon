import React from 'react';

import LogicalConnectionKpiSparkCharts from
  'in-sdk/components/sidebar/defaultLogicalConnectionSidebars/LogicalConnectionKpiSparkCharts';
import ConnectedEntitiesList from 'in-sdk/components/sidebar/ConnectedEntitiesList';


export default function LogicalConnectionSidebar({snapshot}) {
  return (
    <div>
      <LogicalConnectionKpiSparkCharts snapshot={snapshot} />

      <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
