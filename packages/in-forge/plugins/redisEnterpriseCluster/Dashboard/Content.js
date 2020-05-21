import React from 'react';

import ClusterNodesTable from 'in-forge/plugins/redisEnterpriseCluster/Dashboard/ClusterNodesTable';
import DatabasesTable from 'in-forge/plugins/redisEnterpriseCluster/Dashboard/DatabasesTable';
import ShardsTable from 'in-forge/plugins/redisEnterpriseCluster/Dashboard/ShardsTable';
import ClusterSummary from 'in-forge/plugins/redisEnterpriseCluster/ClusterSummary';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number } from 'in-services/formatters/number';

export default function RedisEnterpriseClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <ClusterSummary snapshot={snapshot} />

      <DashboardSection title="Key">
        <ChartExplanation>Key hits and misses metrics represent the sum for all nodes in the cluster.</ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['key_hits', 'key_misses'],
            labels: ['Hits', 'Misses'],
            type: 'line',
            formatter: number.compact
          }}
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
            metrics: ['expired_objects', 'evicted_objects'],
            labels: ['Expired', 'Evicted'],
            formatter: number.compact,
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
            formatter: bytes.compact,
            tooltipFormatter: bytes.detailed,
            metrics: ['used_memory', 'used_memory_rss', 'mem_size_lua'],
            labels: ['Used', 'Used RSS', 'Lua Heap Size'],
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
            formatter: number.compact,
            metrics: ['conns'],
            labels: ['Connected'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: number.perSecond,
            metrics: ['total_connections_received'],
            labels: ['Total Received'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <ClusterNodesTable snapshot={snapshot} timeConfig={timeConfig} />
      <ShardsTable snapshot={snapshot} timeConfig={timeConfig} />
      <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
