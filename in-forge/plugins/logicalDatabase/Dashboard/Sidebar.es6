import irpt from 'react-immutable-proptypes';
import React from 'react';

import ConnectionList from 'in-components/sidebars/components/ConnectionList';
import ClusterMembersList from 'in-components/ClusterMembersList';


export default function LogicalDatabaseSidebar({snapshot}) {
  return (
    <div>
      <ClusterMembersList snapshotId={snapshot.get('id')} />
      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}

LogicalDatabaseSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
