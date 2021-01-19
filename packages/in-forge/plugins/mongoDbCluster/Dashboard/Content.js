import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import ReplicaSetsTable from './ReplicaSetsTable';
import { number, bytes } from 'in-services/formatters/number';

export default function MongoDbClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Database Activity">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['documents.returned', 'documents.inserted', 'documents.updated', 'documents.deleted'],
            labels: ['Read', 'Inserted', 'Updated', 'Deleted'],
            type: 'stackedBar',
            aggregation: 'sum',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Clients">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['connections'],
            labels: ['Connections'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Network">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['repl.network_ops'],
            labels: ['Ops'],
            type: 'line'
          }}
          y2={{
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailed,
            metrics: ['repl.network_bytes'],
            labels: ['Bytes'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <ReplicaSetsTable clusterSnapshotId={snapshot.get('id')} timeConfig={timeConfig} />
    </div>
  );
}
