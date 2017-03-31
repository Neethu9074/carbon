import React from 'react';

import JumpToTracesTouchingServiceInstanceButton
  from 'in-sdk/components/sidebar/JumpToTracesTouchingServiceInstanceButton';
import JumpToTracesOfServiceInstanceButton from 'in-sdk/components/sidebar/JumpToTracesOfServiceInstanceButton';
import ServiceInstanceInfo from 'in-sdk/components/sidebar/defaultServiceInstanceSidebars/ServiceInstanceInfo';
import TracesButtonWrapper from 'in-sdk/components/sidebar/TracesButtonWrapper';
import ServiceInstancePhysicalEntity
  from 'in-sdk/components/sidebar/defaultServiceInstanceSidebars/ServiceInstancePhysicalEntity';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';

export default function ServiceInstanceDashboardSidebar({ snapshot }) {
  return (
    <div>
      <TracesButtonWrapper>
        <JumpToTracesOfServiceInstanceButton snapshotId={snapshot.get('id')} />
        <JumpToTracesTouchingServiceInstanceButton snapshotId={snapshot.get('id')} />
      </TracesButtonWrapper>

      <ServiceInstanceInfo snapshotId={snapshot.get('id')} />

      <ServiceInstancePhysicalEntity snapshotId={snapshot.get('id')} />

      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}
