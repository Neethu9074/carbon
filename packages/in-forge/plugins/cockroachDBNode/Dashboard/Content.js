/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { bytesZeroDecimalPlaces, timeByNanoTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import StoreTable from 'in-forge/plugins/cockroachDBNode/Dashboard/StoreTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import NodeSummary from '../NodeSummary.js';

export default function CockroachDBDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <NodeSummary snapshot={snapshot} />

      <DashboardSection title={t('in-forge:plugins.cockroachDBNode.dashboard.titleSQLLatencyQueries')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: timeByNanoTwoDecimalPlaces,
            metrics: ['sql.exec.latency-p99'],
            labels: [t('in-forge:plugins.cockroachDBNode.dashboard.labelLatency')],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['sql.query.count'],
            labels: [t('in-forge:plugins.cockroachDBNode.dashboard.labelQueries')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.cockroachDBNode.dashboard.titleQueries')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['sql.select.count'],
            labels: [t('in-forge:plugins.cockroachDBNode.dashboard.labelSelects')],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['sql.update.count', 'sql.insert.count', 'sql.delete.count'],
            labels: [
              t('in-forge:plugins.cockroachDBNode.dashboard.labelUpdates'),
              t('in-forge:plugins.cockroachDBNode.dashboard.labelInserts'),
              t('in-forge:plugins.cockroachDBNode.dashboard.labelDeletes')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.cockroachDBNode.dashboard.titleSQLLatency')}>
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
              t('in-forge:plugins.cockroachDBNode.dashboard.labelLatency50P'),
              t('in-forge:plugins.cockroachDBNode.dashboard.labelLatency75P'),
              t('in-forge:plugins.cockroachDBNode.dashboard.labelLatency90P'),
              t('in-forge:plugins.cockroachDBNode.dashboard.labelLatency99P'),
              t('in-forge:plugins.cockroachDBNode.dashboard.labelLatencyMax')
            ],
            type: 'integral'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.cockroachDBNode.dashboard.labelGoMemory')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.go.allocbytes', 'sys.go.totalbytes'],
            labels: [
              t('in-forge:plugins.cockroachDBNode.dashboard.labelAllocated'),
              t('in-forge:plugins.cockroachDBNode.dashboard.labelTotal')
            ],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.cockroachDBNode.dashboard.labelCGoMemory')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.cgo.allocbytes', 'sys.cgo.totalbytes'],
            labels: [
              t('in-forge:plugins.cockroachDBNode.dashboard.labelAllocated'),
              t('in-forge:plugins.cockroachDBNode.dashboard.labelTotal')
            ],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.cockroachDBNode.dashboard.titleDisk')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.disk.read.bytes', 'sys.host.disk.write.bytes'],
            labels: [
              t('in-forge:plugins.cockroachDBNode.dashboard.labelReadBytes'),
              t('in-forge:plugins.cockroachDBNode.dashboard.labelWriteBytes')
            ],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          y2={{
            metrics: ['sys.host.disk.read.count', 'sys.host.disk.write.count'],
            labels: [
              t('in-forge:plugins.cockroachDBNode.dashboard.labelReadOps'),
              t('in-forge:plugins.cockroachDBNode.dashboard.labelWriteOps')
            ],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.cockroachDBNode.dashboard.titleDiskIOPS')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.disk.iopsinprogress'],
            labels: [t('in-forge:plugins.cockroachDBNode.dashboard.labelIOPS')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.cockroachDBNode.dashboard.titleNetwork')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.net.recv.bytes'],
            labels: [t('in-forge:plugins.cockroachDBNode.dashboard.labelReceived')],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          y2={{
            metrics: ['sys.host.net.send.bytes'],
            labels: [t('in-forge:plugins.cockroachDBNode.dashboard.labelSent')],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <StoreTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
