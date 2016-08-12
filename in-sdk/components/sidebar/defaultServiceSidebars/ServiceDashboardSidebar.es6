import React from 'react';

import JumpToTracesButton from 'in-sdk/components/sidebar/JumpToTracesButton';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function ServiceDashboardSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <JumpToTracesButton snapshotId={snapshotId}/>

      <Separator />

      <ClusterMemberList snapshotId={snapshotId} />

      <Separator />

      <ConnectionList snapshotId={snapshotId} />
    </div>
  );
}
