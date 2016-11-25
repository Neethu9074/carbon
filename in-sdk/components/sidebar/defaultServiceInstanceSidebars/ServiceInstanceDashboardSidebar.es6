import React from 'react';

import JumpToTracesOfServiceInstanceButton from 'in-sdk/components/sidebar/JumpToTracesOfServiceInstanceButton';
import ServiceInstanceInfo from 'in-sdk/components/sidebar/defaultServiceInstanceSidebars/ServiceInstanceInfo';
import ServiceInstancePhysicalEntity
  from 'in-sdk/components/sidebar/defaultServiceInstanceSidebars/ServiceInstancePhysicalEntity';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';

export default function ServiceInstanceDashboardSidebar({snapshot}) {
  return (
    <div>
      <JumpToTracesOfServiceInstanceButton snapshotId={snapshot.get('id')} />

      <ServiceInstanceInfo snapshotId={snapshot.get('id')} />

      <ServiceInstancePhysicalEntity snapshotId={snapshot.get('id')} />

      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}
