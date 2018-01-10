import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';

import ZKStandaloneDashboard from './ZKStandaloneDashboard';
import ZKReplicatedDashboard from './ZKReplicatedDashboard';

export default function ZooKeeperDashboard({ snapshot, timeframe }) {
  const peerNames = snapshot.getIn(['data', 'peer_names'], emptyList);

  return (
    <div>
      <ZKStandaloneDashboard snapshot={snapshot} timeframe={timeframe} />
      {peerNames.size > 0 ? <ZKReplicatedDashboard snapshot={snapshot} timeframe={timeframe} /> : null}
    </div>
  );
}
