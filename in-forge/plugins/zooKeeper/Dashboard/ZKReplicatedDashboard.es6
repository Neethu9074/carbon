import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { emptyList } from 'in-services/fixedImmutables';

export default function ZKReplicatedDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const localPeerNames = extractLocalPeerNames(snapshot);

  return (
    <div>
      <DashboardSection title="Ticks">
        {localPeerNames.map(peer => (
          <ChartWithLegend
            key={peer}
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['peers.' + peer + '.tick'],
              labels: [peer + ': Ticks'],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
        ))}
      </DashboardSection>
    </div>
  );
}

function extractLocalPeerNames(snapshot) {
  const peerNames = snapshot.getIn(['data', 'peer_names'], emptyList);
  const data = snapshot.get('data');
  const localPeers = [];
  peerNames.map(p => {
    if (data.get('quorum.' + p + '.state') !== undefined) {
      localPeers.push(p);
    }
  });

  return localPeers.sort();
}
