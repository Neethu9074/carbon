import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';

import Info from '../Info';

export default function CouchbaseClusterSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Couchbase Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <ClusterMemberList snapshotId={snapshotId} />
    </div>
  );
}
