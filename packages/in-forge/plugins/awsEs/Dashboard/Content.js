/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { themes } from '@instana/design-tokens';

import {
  percentagePlainZeroDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces,
  timeByMillisTwoDecimalPlaces,
  seconds,
  number,
  bytes
} from 'in-services/formatters/number';
import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ESClusterSummary from 'in-forge/plugins/awsEs/ESClusterSummary';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default function AwsElasticSearchDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <ESClusterSummary snapshot={snapshot} />
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsEs.titlePerformanceIndicator')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['search_latency'],
              labels: [t('in-forge:plugins.awsEs.labelSearchLatency')],
              type: 'line',
              formatter: timeByMillisTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsEs.titleClusterStatus')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cluster_status_green', 'cluster_status_yellow', 'cluster_status_red'],
              labels: [
                t('in-forge:plugins.awsEs.labelGreen'),
                t('in-forge:plugins.awsEs.labelYellow'),
                t('in-forge:plugins.awsEs.labelRed')
              ],
              type: 'stackedArea',
              formatter: number.compact,
              colors: [
                themes.default.ids.color.option.green['500'],
                themes.default.ids.color.option.yellow['500'],
                themes.default.ids.color.option.red['500']
              ]
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.titleCPU')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cpu_utilization'],
              labels: [t('in-forge:plugins.awsEs.labelUtilization')],
              type: 'stackedArea',
              formatter: percentagePlainZeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsEs.titleCPUCredit')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cpu_credit_balance'],
              labels: [t('in-forge:plugins.awsEs.labelBalance')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsEs.titleDocuments')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['searchable_documents', 'deleted_documents'],
              labels: [
                t('in-forge:plugins.awsEs.labelSearchableDocument'),
                t('in-forge:plugins.awsEs.labelDeletedDocuments')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsEs.titleStorageSpace')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cluster_used_space', 'free_storage_space'],
              labels: [
                t('in-forge:plugins.awsEs.labelClusterUsedSpace'),
                t('in-forge:plugins.awsEs.labelFreeStorageSpace')
              ],
              type: 'stackedArea',
              formatter: bytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsEs.titleClusterDetails')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cluster_index_writes_blocked', 'automated_snapshot_failure'],
              labels: [
                t('in-forge:plugins.awsEs.labelClusterIndexWritesBlocked'),
                t('in-forge:plugins.awsEs.labelAutomatedSnapshotFailure')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsEs.titleJVMMemory')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['jvm_memory_pressure'],
              labels: [t('in-forge:plugins.awsEs.labelJvmMemoryPressure')],
              type: 'line',
              formatter: percentagePlainZeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsEs.titleHTTPRequestsByResponseCode')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['2xx', '3xx', '4xx', '5xx'],
              labels: [
                t('in-forge:plugins.labelRequests.2xx'),
                t('in-forge:plugins.labelRequests.3xx'),
                t('in-forge:plugins.labelRequests.4xx'),
                t('in-forge:plugins.labelRequests.5xx')
              ],
              type: 'line',
              formatter: number.compact,
              colors: [
                themes.default.ids.color.option.green['500'],
                themes.default.ids.color.option.yellow['500'],
                themes.default.ids.color.option.blue['500'],
                themes.default.ids.color.option.red['500']
              ]
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsEs.titleReadWriteLatency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['read_latency', 'write_latency'],
              labels: [t('in-forge:plugins.awsEs.labelReadLatency'), t('in-forge:plugins.awsEs.labelWriteLatency')],
              type: 'line',
              formatter: seconds.fixedCompact,
              colors: [themes.default.ids.color.option.green['500'], themes.default.ids.color.option.red['500']]
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsEs.titleReadWriteThroughput')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['read_throughput', 'write_throughput'],
              labels: [
                t('in-forge:plugins.awsEs.labelReadThroughput'),
                t('in-forge:plugins.awsEs.labelWriteThroughput')
              ],
              type: 'line',
              formatter: bytesPerSecondZeroDecimalPlaces,
              colors: [themes.default.ids.color.option.green['500'], themes.default.ids.color.option.red['500']]
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsEs.titleReadWriteIops')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['read_iops', 'write_iops'],
              labels: [t('in-forge:plugins.awsEs.labelReadIops'), t('in-forge:plugins.awsEs.labelWriteIops')],
              type: 'line',
              formatter: number.perSecond.detailed,
              colors: [themes.default.ids.color.option.green['500'], themes.default.ids.color.option.red['500']]
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
