import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectionList from 'in-components/sidebars/components/ConnectionList';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';


export default function LogicalMongoDBDatabaseSidebar({snapshot}) {
  return (
    <div>
      <ClusterMemberList snapshotId={snapshot.get('id')} />
      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}

LogicalMongoDBDatabaseSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
