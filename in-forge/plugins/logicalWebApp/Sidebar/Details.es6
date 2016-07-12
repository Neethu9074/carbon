import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebarKpis from 'in-components/DefaultLogicalSidebarKpis/DefaultLogicalSidebarKpis';
import ClusterMembersList from 'in-components/ClusterMembersList';


export default function LogicalWebAppSidebar({snapshot}) {
  return (
    <div>
      <DefaultLogicalSidebarKpis snapshot={snapshot} />
      <ClusterMembersList snapshotId={snapshot.get('id')} />
    </div>
  );
}

LogicalWebAppSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
