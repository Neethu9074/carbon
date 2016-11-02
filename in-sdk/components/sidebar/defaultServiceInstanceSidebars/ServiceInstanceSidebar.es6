import React from 'react';

import ServiceInstanceInfo from 'in-sdk/components/sidebar/defaultServiceInstanceSidebars/ServiceInstanceInfo';
import ServiceInstanceKpiSparkCharts from
  'in-sdk/components/sidebar/defaultServiceInstanceSidebars/ServiceInstanceKpiSparkCharts';
import ServiceInstancePhysicalEntity
  from 'in-sdk/components/sidebar/defaultServiceInstanceSidebars/ServiceInstancePhysicalEntity';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function ServiceInstanceSidebar({snapshot}) {
  return (
    <div>
      <ServiceInstanceInfo snapshotId={snapshot.get('id')} />

      <Separator />

      <ServiceInstanceKpiSparkCharts snapshot={snapshot} />

      <ServiceInstancePhysicalEntity snapshotId={snapshot.get('id')} />

      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}
