/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { bytesZeroDecimalPlaces, timeByNanoTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import NodeSummary from '../NodeSummary.js';
import { t } from 'in-i18n';

export default function CockroachDBDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <NodeSummary snapshot={snapshot} />
      <DashboardSection title={t('in-forge:plugins.cockroachDBCluster.dashboard.titleSQLLatency')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: timeByNanoTwoDecimalPlaces,
            metrics: [
              'sql.exec.latency-p50',
              'sql.exec.latency-p75',
              'sql.exec.latency-p90',
              'sql.exec.latency-p99',
              'sql.exec.latency-max'
            ],
            labels: [
              t('in-forge:plugins.cockroachDBCluster.dashboard.labelLatency50P'),
              t('in-forge:plugins.cockroachDBCluster.dashboard.labelLatency75P'),
              t('in-forge:plugins.cockroachDBCluster.dashboard.labelLatency90P'),
              t('in-forge:plugins.cockroachDBCluster.dashboard.labelLatency99P'),
              t('in-forge:plugins.cockroachDBCluster.dashboard.labelLatencyMax')
            ],
            type: 'integral'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.cockroachDBCluster.dashboard.titleDisk')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.disk.read.bytes', 'sys.host.disk.write.bytes'],
            labels: [
              t('in-forge:plugins.cockroachDBCluster.dashboard.labelReadBytes'),
              t('in-forge:plugins.cockroachDBCluster.dashboard.labelWriteBytes')
            ],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          y2={{
            metrics: ['sys.host.disk.read.count', 'sys.host.disk.write.count'],
            labels: [
              t('in-forge:plugins.cockroachDBCluster.dashboard.labelReadOps'),
              t('in-forge:plugins.cockroachDBCluster.dashboard.labelWriteOps')
            ],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.cockroachDBCluster.dashboard.titleDiskIOPS')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.disk.iopsinprogress'],
            labels: [t('in-forge:plugins.cockroachDBCluster.dashboard.labelIOPS')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.cockroachDBCluster.dashboard.titleNetwork')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.net.recv.bytes'],
            labels: [t('in-forge:plugins.cockroachDBCluster.dashboard.labelReceivedBytes')],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          y2={{
            metrics: ['sys.host.net.send.bytes'],
            labels: [t('in-forge:plugins.cockroachDBCluster.dashboard.labelSentBytes')],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
