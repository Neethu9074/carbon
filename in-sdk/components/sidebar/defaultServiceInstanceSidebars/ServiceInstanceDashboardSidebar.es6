import React from 'react';

import JumpToTracesTouchingServiceInstanceButton from 'in-sdk/components/sidebar/JumpToTracesTouchingServiceInstanceButton';
import JumpToTracesOfServiceInstanceButton from 'in-sdk/components/sidebar/JumpToTracesOfServiceInstanceButton';
import ServiceInstanceInfo from 'in-sdk/components/sidebar/defaultServiceInstanceSidebars/ServiceInstanceInfo';
import ServiceInstancePhysicalEntity
  from 'in-sdk/components/sidebar/defaultServiceInstanceSidebars/ServiceInstancePhysicalEntity';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';

export default function ServiceInstanceDashboardSidebar({snapshot}) {
  return (
    <div>
      <JumpToTracesTouchingServiceInstanceButton snapshotId={snapshot.get('id')} />

      <JumpToTracesOfServiceInstanceButton snapshotId={snapshot.get('id')} />

      <ServiceInstanceInfo snapshotId={snapshot.get('id')} />

      <ServiceInstancePhysicalEntity snapshotId={snapshot.get('id')} />

      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}
