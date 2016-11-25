import React from 'react';

import JumpToTracesOfServiceButton from 'in-sdk/components/sidebar/JumpToTracesOfServiceButton';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';

export default function ServiceDashboardSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <JumpToTracesOfServiceButton snapshotId={snapshotId} />

      <ClusterMemberList snapshotId={snapshotId} />

      <ConnectionList snapshotId={snapshotId} />
    </div>
  );
}
