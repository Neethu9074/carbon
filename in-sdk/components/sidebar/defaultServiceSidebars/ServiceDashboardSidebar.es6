import React from 'react';

import JumpToTracesTouchingServiceButton from 'in-sdk/components/sidebar/JumpToTracesTouchingServiceButton';
import TracesButtonWrapper from 'in-sdk/components/sidebar/defaultServiceSidebars/TracesButtonWrapper';
import JumpToTracesOfServiceButton from 'in-sdk/components/sidebar/JumpToTracesOfServiceButton';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';

export default function ServiceDashboardSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <TracesButtonWrapper>
        <JumpToTracesTouchingServiceButton snapshotId={snapshotId} />
        <JumpToTracesOfServiceButton snapshotId={snapshotId} />
      </TracesButtonWrapper>

      <ClusterMemberList snapshotId={snapshotId} />

      <ConnectionList snapshotId={snapshotId} />
    </div>
  );
}
