import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebarKpis from 'in-sdk/components/sidebar/DefaultLogicalSidebarKpis';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function DefaultLogicalSidebar({snapshot}) {
  return (
    <div>
      <DefaultLogicalSidebarKpis snapshot={snapshot} />
      <Separator />
      <ClusterMemberList snapshotId={snapshot.get('id')} />
      <Separator />
      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}

DefaultLogicalSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
