/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { bytesTwoDecimalPlaces, bytesZeroDecimalPlaces, number } from 'in-services/formatters/number';
import ClusterNodesTable from 'in-forge/plugins/redisCluster/Dashboard/ClusterNodesTable.js';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import ClusterSummary from 'in-forge/plugins/redisCluster/ClusterSummary';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

export default function RedisClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <Fragment>
      <ClusterSummary snapshot={snapshot} />
      <DashboardSection title="Throughput">
        <ChartExplanation>Throughput metric represents the sum for all nodes in the cluster.</ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['throughput'],
            labels: ['Throughput (ops/sec)'],
            formatter: number,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Key">
        <ChartExplanation>Key hits and misses metrics represent the sum for all nodes in the cluster.</ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['keyspace_hits', 'keyspace_misses'],
            labels: ['Hits', 'Misses'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Objects">
        <ChartExplanation>
          Key expired and evicted metrics represent the sum for all nodes in the cluster.
        </ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['expired_keys', 'evicted_keys'],
            labels: ['Keys Expired', 'Keys Evicted'],
            formatter: number,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Memory">
        <ChartExplanation>Memory metrics represent the sum for all nodes in the cluster.</ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['used_memory', 'used_memory_rss', 'used_memory_lua'],
            labels: ['Used', 'Used rss', 'Used lua'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Connections">
        <ChartExplanation>Connections metrics represent the sum for all nodes in the cluster.</ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['connected_clients', 'blocked_clients', 'rejected_connections'],
            labels: ['Connected', 'Blocked', 'Rejected connections'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Messages">
        <ChartExplanation>
          The number of messages sent and received via the cluster node-to-node binary bus.
        </ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cluster_stats_messages_sent', 'cluster_stats_messages_received'],
            labels: ['Sent', 'Received'],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <ClusterNodesTable snapshot={snapshot} timeConfig={timeConfig} />
    </Fragment>
  );
}
