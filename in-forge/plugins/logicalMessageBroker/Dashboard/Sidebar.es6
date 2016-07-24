import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectionList from 'in-components/sidebars/components/ConnectionList';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';


export default function LogicalMessageBrokerSidebar({snapshot}) {
  return (
    <div>
      <ClusterMemberList snapshotId={snapshot.get('id')} />
      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}

LogicalMessageBrokerSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
