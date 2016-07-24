import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebarKpis from 'in-components/DefaultLogicalSidebarKpis/DefaultLogicalSidebarKpis';
import ConnectionList from 'in-components/sidebars/components/ConnectionList';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';


export default function LogicalServiceSidebar({snapshot}) {
  return (
    <div>
      <DefaultLogicalSidebarKpis snapshot={snapshot} />
      <ClusterMemberList snapshotId={snapshot.get('id')} />
      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}

LogicalServiceSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
