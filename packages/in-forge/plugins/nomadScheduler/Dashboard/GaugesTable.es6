import React from 'react';

import { withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import Table from 'in-sdk/components/dashboard/Table';

const metrics = [
  'nomad.nomad.heartbeat.active',
  'nomad.nomad.plan.queue_depth',
  'nomad.nomad.vault.distributed_tokens_revoking',
  'nomad.runtime.alloc_bytes',
  'nomad.runtime.free_count',
  'nomad.runtime.heap_objects',
  'nomad.runtime.malloc_count',
  'nomad.runtime.sys_bytes',
  'nomad.runtime.total_gc_pause_ns',
  'nomad.runtime.total_gc_runs',
  'nomad.runtime.num_goroutines'
];

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Value',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `${row.name}`;
      },
      getContent: withSiPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function Gauges({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = metrics.map(name => {
    return {
      key: name,
      name,
      snapshotId,
      timeConfig
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Gauges (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} maxItemsPerPage={100} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      margins={{
        left: 90
      }}
      y1={{
        formatter: withSiPrefixZeroDecimalPlaces,
        metrics: [row.name],
        labels: [row.name],
        type: 'line'
      }}
    />
  );
}
