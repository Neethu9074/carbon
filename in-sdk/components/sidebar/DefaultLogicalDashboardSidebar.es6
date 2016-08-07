import React from 'react';

import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function DefaultLogicalDashboardSidebar({snapshot}) {
  return (
    <div>
      <ClusterMemberList snapshotId={snapshot.get('id')} />
      <Separator />
      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}
