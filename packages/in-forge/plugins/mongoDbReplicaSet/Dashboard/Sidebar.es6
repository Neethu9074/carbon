import React from 'react';

import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';

import { emptyList } from 'in-services/fixedImmutables';

import Info from '../Info';

export default function ReplicaSetSidebar({ snapshot }) {
  const replicaSetAr = snapshot.getIn(['data', 'members'], emptyList);
  const rsMembers = replicaSetAr.map(v => '[' + v.get('id') + '] ' + v.get('name') + ' : ' + v.get('state'));

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

      <KeyValuePopup header="Replica Set Members" data={rsMembers} />
    </div>
  );
}
