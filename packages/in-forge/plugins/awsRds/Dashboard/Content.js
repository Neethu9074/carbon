/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import DBmarlinNotification from 'in-forge/plugins/awsRds/Dashboard/DBmarlinNotification';
import { number, percentage, bytes, millis } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

export default function AwsRdsDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <DashboardSection title={t('in-forge:plugins.awsRds.dashboard.cpuUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['cpu_utilization'],
            labels: [t('in-forge:plugins.awsRds.dashboard.cpuUtilization')],
            formatter: percentage.detailed,
            type: 'line'
          }}
          y2={{
            metrics: ['cpu_credit_usage', 'cpu_credit_balance'],
            labels: [
              t('in-forge:plugins.awsRds.dashboard.cpuCreditUsage'),
              t('in-forge:plugins.awsRds.dashboard.cpuCreditBalance')
            ],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsRds.dashboard.disk')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['disk_queue_depth'],
            labels: [t('in-forge:plugins.awsRds.dashboard.diskQueueDepth')],
            formatter: number.detailed,
            type: 'line'
          }}
          y2={{
            metrics: ['burst_balance'],
            labels: [t('in-forge:plugins.awsRds.dashboard.burstBalance')],
            formatter: percentage.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['free_storage_space'],
            labels: [t('in-forge:plugins.awsRds.dashboard.availableStorageSpace')],
            formatter: bytes.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsRds.dashboard.dbConnections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['db_connections'],
            labels: [t('in-forge:plugins.awsRds.dashboard.connections')],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsRds.dashboard.memory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['freeable_memory', 'swap_usage'],
            labels: [
              t('in-forge:plugins.awsRds.dashboard.freeableRam'),
              t('in-forge:plugins.awsRds.dashboard.swapUsage')
            ],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsRds.dashboard.ioOperations')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['read_iops', 'write_iops'],
            labels: [t('in-forge:plugins.awsRds.dashboard.readOps'), t('in-forge:plugins.awsRds.dashboard.writeOps')],
            formatter: number.perSecond.compact,
            type: 'line'
          }}
          y2={{
            metrics: ['read_latency', 'write_latency'],
            labels: [
              t('in-forge:plugins.awsRds.dashboard.readLatency'),
              t('in-forge:plugins.awsRds.dashboard.writeLatency')
            ],
            formatter: millis.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsRds.dashboard.ioThroughput')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['read_throughput', 'write_throughput'],
            labels: [
              t('in-forge:plugins.awsRds.dashboard.readThroughput'),
              t('in-forge:plugins.awsRds.dashboard.writeThroughput')
            ],
            formatter: bytes.perSecond.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsRds.dashboard.networkTraffic')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['net_receive_throughput', 'net_transmit_throughput'],
            labels: [
              t('in-forge:plugins.awsRds.dashboard.receiveThroughput'),
              t('in-forge:plugins.awsRds.dashboard.transmitThroughput')
            ],
            formatter: bytes.perSecond.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsRds.dashboard.readReplicaDb')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['replica_lag'],
            labels: [t('in-forge:plugins.awsRds.dashboard.replicaLag')],
            formatter: millis.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {snapshot.getIn(['data', 'db_engine']) === 'aurora' && (
        <DashboardSection title={t('in-forge:plugins.awsRds.dashboard.volumeBytesUsed')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['volume_bytes_used_avg'],
              labels: [t('in-forge:plugins.awsRds.dashboard.volumeBytesUsed')],
              type: 'line',
              formatter: bytes.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
      <DBmarlinNotification />
    </div>
  );
}
