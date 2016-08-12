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
      <ServiceInstanceKpiSparkCharts snapshot={snapshot} />

      <Separator />

      <ServiceInstanceInfo snapshotId={snapshot.get('id')} />

      <Separator />

      <ServiceInstancePhysicalEntity snapshotId={snapshot.get('id')} />

      <Separator />

      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}
