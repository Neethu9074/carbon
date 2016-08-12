import React from 'react';

import LogicalConnectionKpiSparkCharts from
  'in-sdk/components/sidebar/defaultLogicalConnectionSidebars/LogicalConnectionKpiSparkCharts';
import ConnectedEntitiesList from 'in-sdk/components/sidebar/ConnectedEntitiesList';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function LogicalConnectionSidebar({snapshot}) {
  return (
    <div>
      <LogicalConnectionKpiSparkCharts snapshot={snapshot} />

      <Separator />

      <ConnectedEntitiesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
