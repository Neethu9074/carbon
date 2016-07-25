import irpt from 'react-immutable-proptypes';
import React from 'react';

import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';

export default function CassandraClusterSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <ClusterMemberList snapshotId={snapshotId} />
    </div>
  );
}

CassandraClusterSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
