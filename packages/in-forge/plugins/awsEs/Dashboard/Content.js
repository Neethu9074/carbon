/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';
import React from 'react';

import {
  percentagePlainZeroDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces,
  timeByMillisTwoDecimalPlaces,
  seconds,
  number,
  bytes
} from 'in-services/formatters/number';
import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import ESClusterSummary from 'in-forge/plugins/awsEs/ESClusterSummary';
import Columize from 'in-sdk/components/dashboard/Columize';

export default function AwsElasticSearchDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <ESClusterSummary snapshot={snapshot} />
      <Columize>
        <DashboardSection title="Performance indicator">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['search_latency'],
              labels: ['Search latency'],
              type: 'line',
              formatter: timeByMillisTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Cluster status">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cluster_status_green', 'cluster_status_yellow', 'cluster_status_red'],
              labels: ['Green', 'Yellow', 'Red'],
              type: 'stackedArea',
              formatter: number.compact,
              colors: [theme.lib.colors.green800, theme.lib.colors.yellow800, theme.lib.colors.red800]
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="CPU">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cpu_utilization'],
              labels: ['Utilization'],
              type: 'stackedArea',
              formatter: percentagePlainZeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="CPU Credit">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cpu_credit_balance'],
              labels: ['Balance'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Documents">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['searchable_documents', 'deleted_documents'],
              labels: ['Searchable documents', 'Deleted documents'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Storage space">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cluster_used_space', 'free_storage_space'],
              labels: ['Cluster used space', 'Free storage space'],
              type: 'stackedArea',
              formatter: bytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Cluster details">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cluster_index_writes_blocked', 'automated_snapshot_failure'],
              labels: ['Cluster index writes blocked', 'Automated snapshot failure'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="JVM memory">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['jvm_memory_pressure'],
              labels: ['Jvm memory pressure'],
              type: 'line',
              formatter: percentagePlainZeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="HTTP requests by response code">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['2xx', '3xx', '4xx', '5xx'],
              labels: ['2xx', '3xx', '4xx', '5xx'],
              type: 'line',
              formatter: number.compact,
              colors: [
                theme.lib.colors.green800,
                theme.lib.colors.yellow800,
                theme.lib.colors.blue800,
                theme.lib.colors.red800
              ]
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Read/write latency">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['read_latency', 'write_latency'],
              labels: ['read_latency', 'write_latency'],
              type: 'line',
              formatter: seconds.fixedCompact,
              colors: [theme.lib.colors.green800, theme.lib.colors.red800]
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Read/write throughput">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['read_throughput', 'write_throughput'],
              labels: ['Read throughput', 'Write throughput'],
              type: 'line',
              formatter: bytesPerSecondZeroDecimalPlaces,
              colors: [theme.lib.colors.green800, theme.lib.colors.red800]
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Read/write iops">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['read_iops', 'write_iops'],
              labels: ['Read iops', 'Write iops'],
              type: 'line',
              formatter: number.perSecond.detailed,
              colors: [theme.lib.colors.green800, theme.lib.colors.red800]
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
