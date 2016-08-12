import React from 'react';

import ServiceInstanceKpiSparkCharts from
  'in-sdk/components/sidebar/defaultServiceInstanceSidebars/ServiceInstanceKpiSparkCharts';
import ServiceInstancePhysicalEntity from 'in-sdk/components/sidebar/ServiceInstancePhysicalEntity';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function ServiceInstanceSidebar({snapshot}) {
  return (
    <div>
      <ServiceInstanceKpiSparkCharts snapshot={snapshot} />

      <Separator />

      <ServiceInstancePhysicalEntity snapshotId={snapshot.get('id')} />

      <Separator />

      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}
