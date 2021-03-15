/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes } from 'in-services/formatters/number';
import ReplicaSetsTable from './ReplicaSetsTable';
import { t } from 'in-i18n';

export default function MongoDbClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.mongoDbCluster.databaseActivity')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['documents.returned', 'documents.inserted', 'documents.updated', 'documents.deleted'],
            labels: [
              t('in-forge:plugins.mongoDbCluster.read'),
              t('in-forge:plugins.mongoDbCluster.inserted'),
              t('in-forge:plugins.mongoDbCluster.updated'),
              t('in-forge:plugins.mongoDbCluster.deleted')
            ],
            type: 'stackedBar',
            aggregation: 'sum',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.mongoDbCluster.clients')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['connections'],
            labels: [t('in-forge:plugins.mongoDbCluster.connections')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.mongoDbCluster.network')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['repl.network_ops'],
            labels: [t('in-forge:plugins.mongoDbCluster.ops')],
            type: 'line'
          }}
          y2={{
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailed,
            metrics: ['repl.network_bytes'],
            labels: [t('in-forge:plugins.mongoDbCluster.bytes')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <ReplicaSetsTable clusterSnapshotId={snapshot.get('id')} timeConfig={timeConfig} />
    </div>
  );
}
