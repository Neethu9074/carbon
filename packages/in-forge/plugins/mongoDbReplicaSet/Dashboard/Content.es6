import React from 'react';

import { number, bytes, millis } from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function MongoDbReplicaSetDashboard({ snapshot, timeConfig }) {
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
            type: 'bar',
            aggregation: 'sum',
            formatter: number.compact
          }}
        />
      </DashboardSection>

      <DashboardSection title="Replication Performance">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: millis.compact,
            tooltipFormatter: millis.compact,
            metrics: ['repl.replication_lag'],
            labels: ['Replication Lag'],
            type: 'line'
          }}
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
        />
      </DashboardSection>

      <DashboardSection title="Apply Operations">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['repl.apply_ops', 'repl.apply_bathes'],
            labels: ['Apply Ops', 'Apply batches'],
            type: 'line'
          }}
          y2={{
            formatter: millis.detailed,
            tooltipFormatter: millis.detailed,
            metrics: ['repl.apply_bathes_total_ms'],
            labels: ['Apply batches total'],
            type: 'line'
          }}
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
        />
      </DashboardSection>

      <DashboardSection title="Buffer">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['repl.buffer_count'],
            labels: ['Count'],
            type: 'line'
          }}
          y2={{
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailed,
            metrics: ['repl.buffer_size_bytes'],
            labels: ['Buffer Size'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Preload">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['repl.preload_docs_num', 'repl.preload_idx_num'],
            labels: ['Docs', 'Indexes'],
            type: 'line'
          }}
          y2={{
            formatter: millis.detailed,
            tooltipFormatter: millis.detailed,
            metrics: ['repl.preload_docs_total_ms', 'repl.preload_idx_total_ms'],
            labels: ['Docs total', 'Indexes total'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
