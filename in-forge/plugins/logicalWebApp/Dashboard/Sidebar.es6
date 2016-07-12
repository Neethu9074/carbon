import irpt from 'react-immutable-proptypes';
import React from 'react';

import ClusterMembersList from 'in-components/ClusterMembersList';


export default function LogicalWebAppSidebar({snapshot}) {
  return (
    <div>
      <ClusterMembersList snapshotId={snapshot.get('id')} />
    </div>
  );
}

LogicalWebAppSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
