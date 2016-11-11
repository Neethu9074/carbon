import React from 'react';

import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function NodejsClusterSidebar({snapshot}) {
  return (
    <div>
      <Separator />
      <ClusterMemberList snapshotId={snapshot.get('id')} />
    </div>
  );
}
