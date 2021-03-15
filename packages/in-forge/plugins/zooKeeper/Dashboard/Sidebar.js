/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import StandaloneInfo from 'in-forge/plugins/zooKeeper/StandaloneInfo';
import ReplicatedInfo from 'in-forge/plugins/zooKeeper/ReplicatedInfo';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function ZooKeeperSidebar({ snapshot }) {
  const peerNames = snapshot.getIn(['data', 'peer_names'], emptyList);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.zooKeeper.headerZooKeeperInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <StandaloneInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {peerNames.map(peerName => (
        <div key={peerName}>
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>
              {t('in-forge:plugins.zooKeeper.headerPeerName', { peerName: peerName })}
            </Collapsible.Header>
            <Collapsible.Content>
              <ReplicatedInfo snapshot={snapshot} peer={peerName} />
            </Collapsible.Content>
          </Collapsible>
        </div>
      ))}
    </div>
  );
}
