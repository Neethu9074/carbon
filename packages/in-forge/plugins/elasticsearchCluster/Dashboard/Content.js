import React from 'react';

import {
  withSiPrefixZeroDecimalPlaces,
  withSiPrefixThreeDecimalPlaces,
  twoDecimalPlaces,
  msTwoDecimalPlaces,
  msZeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import ClusterNodesTable from 'in-forge/plugins/elasticsearchCluster/Dashboard/ClusterNodesTable';
import IndicesTable from 'in-forge/plugins/elasticsearchCluster/Dashboard/IndicesTable.js';
import ClusterSummary from 'in-forge/plugins/elasticsearchCluster/ClusterSummary';
import Columize from 'in-sdk/components/dashboard/Columize';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

export default function ElasticsearchClusterDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <ClusterSummary snapshot={snapshot} />

      <DashboardSection title="Latency vs. Number of Queries">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: msZeroDecimalPlaces,
            tooltipFormatter: msTwoDecimalPlaces,
            metrics: ['query_latency'],
            labels: ['Latency'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: withSiPrefixZeroDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            metrics: ['query_count'],
            labels: ['Number Of Queries'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Documents">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: withSiPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            metrics: ['document_count'],
            labels: ['Overall Documents'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: withSiPrefixThreeDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            metrics: ['index_count', 'deleted_count'],
            labels: ['Added', 'Removed'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title="Indices">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: withSiPrefixZeroDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces,
              metrics: ['indices_count'],
              labels: ['Indices'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Shards">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: withSiPrefixThreeDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces,
              metrics: [
                'active_shards',
                'active_primaryshards',
                'initializing_shards',
                'relocating_shards',
                'unassigned_shards'
              ],
              labels: ['Active', 'Active Primary', 'Initializing', 'Relocating', 'Unassigned'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Cluster State Size">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['clusterState.totalStateSize'],
            labels: ['Cluster State Size'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <ClusterNodesTable clusterSnapshotId={snapshot.get('id')} timeConfig={timeConfig} />

      <IndicesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
