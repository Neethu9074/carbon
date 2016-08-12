import React from 'react';

import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';

import Info from '../Info';


export default function CassandraClusterSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Info snapshot={snapshot}/>
      <ClusterMemberList snapshotId={snapshotId} />
    </div>
  );
}
