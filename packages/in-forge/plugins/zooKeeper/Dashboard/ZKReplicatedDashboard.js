/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';

export default function ZKReplicatedDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const localPeerNames = extractLocalPeerNames(snapshot);

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.zooKeeper.titleTicks')}>
        {localPeerNames.map(peer => (
          <Chart
            key={peer}
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['peers.' + peer + '.tick'],
              labels: [t('in-forge:plugins.zooKeeper.labelPeerTicks', { peer: peer })],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
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
