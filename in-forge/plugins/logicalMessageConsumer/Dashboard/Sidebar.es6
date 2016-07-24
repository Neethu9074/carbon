import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectionList from 'in-components/sidebars/components/ConnectionList';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';


export default function LogicalMessageConsumerSidebar({snapshot}) {
  return (
    <div>
      <ClusterMemberList snapshotId={snapshot.get('id')} />
      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}

LogicalMessageConsumerSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
