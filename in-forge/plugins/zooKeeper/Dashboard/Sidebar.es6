import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import StandaloneInfo from 'in-forge/plugins/zooKeeper/StandaloneInfo';
import ReplicatedInfo from 'in-forge/plugins/zooKeeper/ReplicatedInfo';
import ModeInfo from 'in-forge/plugins/zooKeeper/ModeInfo';
import {emptyList} from 'in-services/fixedImmutables';

export default function ZooKeeperSidebar({snapshot}) {
  const version = snapshot.getIn(['data', 'version']);
  if (version) {
    return (
      <div>
        <Separator />

        <ModeInfo snapshot={snapshot} />

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>
            ZooKeeper Info
          </Collapsible.Header>
          <Collapsible.Content>
            <StandaloneInfo snapshot={snapshot}/>
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
  const peerNames = snapshot.getIn(['data', 'peer_names'], emptyList).sort();
  if (peerNames.size === 0) {
    return null;
  }

  return (
    <div>
      <Separator />

      <ModeInfo snapshot={snapshot} />

      {peerNames.map(peerName =>
        <div key={peerName}>
          <Separator />

          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>
              Peer: {peerName}
            </Collapsible.Header>
            <Collapsible.Content>
              <ReplicatedInfo snapshot={snapshot} peer={peerName} />
            </Collapsible.Content>
          </Collapsible>
        </div>
      )}
    </div>
  );
}
