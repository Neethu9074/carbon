/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import {
  percentagePlainTwoDecimalPlaces,
  zeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  seconds
} from 'in-services/formatters/number';
// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AzurePostgreSQLDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');

  return (
    <>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.azurePostgreSQL.kpi.labelActiveConnections')}>
          <MetricValue snapshotId={snapshotId} metric="active_connections" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azurePostgreSQL.kpi.labelCpuPercent')}>
          <MetricValue snapshotId={snapshotId} metric="cpu_percent" formatter={percentagePlainTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.azurePostgreSQL.dashboard.titleConnections')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['active_connections', 'connections_failed', 'connections_succeeded'],
              labels: [
                t('in-forge:plugins.azurePostgreSQL.dashboard.labelActiveConnections'),
                t('in-forge:plugins.azurePostgreSQL.dashboard.labelConnectionsFailed'),
                t('in-forge:plugins.azurePostgreSQL.dashboard.labelConnectionsSucceeded')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.azurePostgreSQL.dashboard.titleCpuPercent')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['cpu_percent'],
              labels: [t('in-forge:plugins.azurePostgreSQL.dashboard.labelUsed')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azurePostgreSQL.dashboard.titleMemoryPercent')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['memory_percent'],
              labels: [t('in-forge:plugins.azurePostgreSQL.dashboard.labelUsed')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azurePostgreSQL.dashboard.titleDeadlocks')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['deadlocks'],
              labels: [t('in-forge:plugins.azurePostgreSQL.dashboard.labelDeadlocks')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.azurePostgreSQL.dashboard.titleThroughput')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['read_throughput', 'write_throughput'],
              labels: [
                t('in-forge:plugins.azurePostgreSQL.dashboard.labelReadThroughput'),
                t('in-forge:plugins.azurePostgreSQL.dashboard.labelWriteThroughput')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azurePostgreSQL.dashboard.titleLongestQueryTime')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: seconds.fixedDetailed,
              metrics: ['longest_query_time_sec'],
              labels: [t('in-forge:plugins.azurePostgreSQL.dashboard.labelLongestQueryTimeSec')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azurePostgreSQL.dashboard.titleLogicalReplicationDelay')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['logical_replication_delay_in_bytes'],
              labels: [t('in-forge:plugins.azurePostgreSQL.dashboard.labelLogicalReplicationDelayInBytes')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.azurePostgreSQL.dashboard.titleIops')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['write_iops', 'read_iops', 'iops'],
              labels: [
                t('in-forge:plugins.azurePostgreSQL.dashboard.labelWriteIops'),
                t('in-forge:plugins.azurePostgreSQL.dashboard.labelReadIops'),
                t('in-forge:plugins.azurePostgreSQL.dashboard.labelIops')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azurePostgreSQL.dashboard.titleNetwork')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['network_bytes_ingress', 'network_bytes_egress'],
              labels: [
                t('in-forge:plugins.azurePostgreSQL.dashboard.labelNetworkBytesIngress'),
                t('in-forge:plugins.azurePostgreSQL.dashboard.labelNetworkBytesEgress')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.azurePostgreSQL.dashboard.titleStorageUsed')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['storage_percent'],
              labels: [t('in-forge:plugins.azurePostgreSQL.dashboard.labelStoragePercent')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azurePostgreSQL.dashboard.titleStorage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['storage_used', 'storage_free', 'backup_storage_used'],
              labels: [
                t('in-forge:plugins.azurePostgreSQL.dashboard.labelUsed'),
                t('in-forge:plugins.azurePostgreSQL.dashboard.labelStorageFree'),
                t('in-forge:plugins.azurePostgreSQL.dashboard.labelBackupStorageUsed')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </>
  );
}
