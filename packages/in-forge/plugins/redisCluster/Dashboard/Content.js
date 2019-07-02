import React, { Fragment } from 'react';

import { bytesTwoDecimalPlaces, bytesZeroDecimalPlaces, number } from 'in-services/formatters/number';
import ClusterNodesTable from 'in-forge/plugins/redisCluster/Dashboard/ClusterNodesTable.js';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ClusterSummary from 'in-forge/plugins/redisCluster/ClusterSummary';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';

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
            formatter: number.detailed,
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Key Hits/Misses">
        <ChartExplanation>Key hits and misses metrics represent the sum for all nodes in the cluster.</ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['keyspace_hits', 'keyspace_misses'],
            labels: ['Key Hits', 'Key Misses'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Key Expired/Evicted">
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
            formatter: number.detailed,
            type: 'line'
          }}
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
        />
      </DashboardSection>

      <ClusterNodesTable snapshot={snapshot} timeConfig={timeConfig} />
    </Fragment>
  );
}
