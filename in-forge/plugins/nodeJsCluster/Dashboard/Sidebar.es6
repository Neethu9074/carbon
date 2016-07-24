import irpt from 'react-immutable-proptypes';
import React from 'react';

import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';


export default function NodejsClusterSidebar({snapshot}) {
  return <ClusterMemberList snapshotId={snapshot.get('id')} />;
}

NodejsClusterSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
