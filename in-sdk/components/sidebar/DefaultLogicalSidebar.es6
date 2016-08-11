import React from 'react';

import DefaultLogicalSidebarKpis from 'in-sdk/components/sidebar/DefaultLogicalSidebarKpis';
import JumpToTracesButton from 'in-sdk/components/sidebar/JumpToTracesButton';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function DefaultLogicalSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <JumpToTracesButton snapshotId={snapshotId}/>
      <Separator />
      <DefaultLogicalSidebarKpis snapshot={snapshot} />
      <Separator />
      <ClusterMemberList snapshotId={snapshotId} />
      <Separator />
      <ConnectionList snapshotId={snapshotId} />
    </div>
  );
}
