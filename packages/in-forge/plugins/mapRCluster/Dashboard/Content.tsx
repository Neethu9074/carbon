/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import ClusterMembersTable from 'in-forge/plugins/mapRCluster/Dashboard/Tables/ClusterMembersTable';
import ServiceListTable from 'in-forge/plugins/mapRCluster/Dashboard/Tables/ServiceListTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function MapRClusterDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.mapRCluster.nodesConnected')}>
          <MetricValue snapshotId={snapshotId} metric="metrics.nodeConnected" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.mapRCluster.nodesConfigured')}>
          {getDataFromSnapshotData(snapshot, 'nodesUsed')}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.mapRCluster.totalMapRFSDisks')}>
          {getDataFromSnapshotData(snapshot, 'mapRFSDisks')}
        </KpiKeyValue>
      </KpiSection>
      <ServiceListTable snapshot={snapshot} timeConfig={timeConfig} />
      <ClusterMembersTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

function getDataFromSnapshotData(snapshot: SnapshotData, key: String) {
  const data = snapshot.get('data');
  var value = data.get(key);
  return String(value);
}
