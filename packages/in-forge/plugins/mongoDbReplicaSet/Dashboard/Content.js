/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function MongoDbReplicaSetDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.mongoDbReplicaSet.databaseActivity')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['documents.returned', 'documents.inserted', 'documents.updated', 'documents.deleted'],
            labels: [
              t('in-forge:plugins.mongoDbReplicaSet.read'),
              t('in-forge:plugins.mongoDbReplicaSet.inserted'),
              t('in-forge:plugins.mongoDbReplicaSet.updated'),
              t('in-forge:plugins.mongoDbReplicaSet.deleted')
            ],
            type: 'stackedBar',
            aggregation: 'sum',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.mongoDbReplicaSet.replicationPerformance')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: millis.compact,
            tooltipFormatter: millis.compact,
            metrics: ['repl.replication_lag'],
            labels: [t('in-forge:plugins.mongoDbReplicaSet.replicationLag')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.mongoDbReplicaSet.clients')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['connections'],
            labels: [t('in-forge:plugins.mongoDbReplicaSet.connections')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.mongoDbReplicaSet.applyOperations')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['repl.apply_ops', 'repl.apply_bathes'],
            labels: [
              t('in-forge:plugins.mongoDbReplicaSet.applyOps'),
              t('in-forge:plugins.mongoDbReplicaSet.applyBatches')
            ],
            type: 'line'
          }}
          y2={{
            formatter: millis.detailed,
            tooltipFormatter: millis.detailed,
            metrics: ['repl.apply_bathes_total_ms'],
            labels: [t('in-forge:plugins.mongoDbReplicaSet.applyBatchesTotal')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.mongoDbReplicaSet.network')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['repl.network_ops'],
            labels: [t('in-forge:plugins.mongoDbReplicaSet.ops')],
            type: 'line'
          }}
          y2={{
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailed,
            metrics: ['repl.network_bytes'],
            labels: [t('in-forge:plugins.mongoDbReplicaSet.bytes')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.mongoDbReplicaSet.buffer')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['repl.buffer_count'],
            labels: [t('in-forge:plugins.mongoDbReplicaSet.count')],
            type: 'line'
          }}
          y2={{
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailed,
            metrics: ['repl.buffer_size_bytes'],
            labels: [t('in-forge:plugins.mongoDbReplicaSet.bufferSize')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.mongoDbReplicaSet.preload')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['repl.preload_docs_num', 'repl.preload_idx_num'],
            labels: [t('in-forge:plugins.mongoDbReplicaSet.docs'), t('in-forge:plugins.mongoDbReplicaSet.indexes')],
            type: 'line'
          }}
          y2={{
            formatter: millis.detailed,
            tooltipFormatter: millis.detailed,
            metrics: ['repl.preload_docs_total_ms', 'repl.preload_idx_total_ms'],
            labels: [
              t('in-forge:plugins.mongoDbReplicaSet.docsTotal'),
              t('in-forge:plugins.mongoDbReplicaSet.indexesTotal')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
