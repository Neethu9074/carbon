import irpt from 'react-immutable-proptypes';
import React from 'react';

import ClusterMembersList from 'in-components/ClusterMembersList';


export default function NodejsClusterSidebar({snapshot}) {
  return <ClusterMembersList snapshotId={snapshot.get('id')} />;
}

NodejsClusterSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
