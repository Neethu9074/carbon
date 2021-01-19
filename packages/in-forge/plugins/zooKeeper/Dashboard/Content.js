/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';

import ZKStandaloneDashboard from './ZKStandaloneDashboard';
import ZKReplicatedDashboard from './ZKReplicatedDashboard';

export default function ZooKeeperDashboard({ snapshot, timeConfig }) {
  const peerNames = snapshot.getIn(['data', 'peer_names'], emptyList);

  return (
    <div>
      <ZKStandaloneDashboard snapshot={snapshot} timeConfig={timeConfig} />
      {peerNames.size > 0 ? <ZKReplicatedDashboard snapshot={snapshot} timeConfig={timeConfig} /> : null}
    </div>
  );
}
