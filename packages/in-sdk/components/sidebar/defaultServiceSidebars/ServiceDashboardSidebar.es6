import React from 'react';

import JumpToTracesTouchingServiceButton from 'in-sdk/components/sidebar/JumpToTracesTouchingServiceButton';
import JumpToTracesOfServiceButton from 'in-sdk/components/sidebar/JumpToTracesOfServiceButton';
import ServiceEndpointsList from 'in-sdk/components/sidebar/ServiceEndpointsList';
import TracesButtonWrapper from 'in-sdk/components/sidebar/TracesButtonWrapper';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';

export default function ServiceDashboardSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <TracesButtonWrapper>
        <JumpToTracesOfServiceButton snapshotId={snapshotId} />
        <JumpToTracesTouchingServiceButton snapshotId={snapshotId} />
      </TracesButtonWrapper>

      <ClusterMemberList snapshotId={snapshotId} />

      <ServiceEndpointsList snapshot={snapshot} />

      <ConnectionList snapshotId={snapshotId} />
    </div>
  );
}
