import React from 'react';

import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function ReplicaSetSidebar({ snapshot }) {
  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen>
        <Collapsible.Header>MongoDb Replica Set</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ClusterMemberList snapshotId={snapshot.get('id')} />
    </div>
  );
}
