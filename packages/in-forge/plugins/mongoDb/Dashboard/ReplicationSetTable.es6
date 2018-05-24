import React from 'react';

import { number, bytes, millis } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Apply Ops',
    type: 'metric',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `repl.apply_ops`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Buffer Size',
    type: 'metric',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `repl.buffer_size_bytes`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Network Ops',
    type: 'metric',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `repl.network_ops`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Replication Lag',
    type: 'metric',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `repl.replication_lag`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ReplicationSetTable({ snapshot, timeConfig }) {
  const replicaSet = snapshot.getIn(['data', 'repl.membersList'], emptyList).toArray();

  if (replicaSet.length == 0) {
    return null;
  }

  const rows = [
    {
      key: 'relica_set',
      timeConfig,
      snapshotId: snapshot.get('id')
    }
  ];

  return (
    <DashboardSection title="Replica Set">
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <DashboardSection title="Apply Operations">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
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
      <DashboardSection title="Buffer">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
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
      <DashboardSection title="Network">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
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
      <DashboardSection title="Preload">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
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
      <DashboardSection title="Replication Performance">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: millis.compact,
            tooltipFormatter: millis.compact,
            metrics: ['repl.replication_lag'],
            labels: ['Replication Lag'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
