import React from 'react';

import { withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import Table from 'in-sdk/components/dashboard/Table';

const metrics = [
  'nomad.client.allocated.disk',
  'nomad.client.allocated.iops',
  'nomad.client.allocated.memory',
  'nomad.client.host.cpu.idle',
  'nomad.client.host.cpu.system',
  'nomad.client.host.cpu.total',
  'nomad.client.host.cpu.user',
  'nomad.client.host.disk.available',
  'nomad.client.host.disk.inodes_percent',
  'nomad.client.host.disk.size',
  'nomad.client.host.disk.used_percent',
  'nomad.client.host.disk.used',
  'nomad.client.host.memory.available',
  'nomad.client.host.memory.free',
  'nomad.client.host.memory.total',
  'nomad.client.host.memory.used',
  'nomad.client.unallocated.disk',
  'nomad.client.unallocated.iops',
  'nomad.client.unallocated.memory',
  'nomad.nomad.heartbeat.active',
  'nomad.nomad.plan.queue_depth',
  'nomad.nomad.vault.distributed_tokens_revoking',
  'nomad.runtime.alloc_bytes',
  'nomad.runtime.free_count',
  'nomad.runtime.heap_objects',
  'nomad.runtime.malloc_count',
  'nomad.runtime.sys_bytes',
  'nomad.runtime.total_gc_pause_ns',
  'nomad.runtime.total_gc_runs'
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
      getContent: withSiPrefixThreeDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function Gauges({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = metrics.map(name => {
    return {
      key: name,
      name,
      snapshotId,
      timeframe
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
      timeframe={row.timeframe}
      margins={{
        left: 90
      }}
      y1={{
        formatter: withSiPrefixThreeDecimalPlaces,
        metrics: [row.name],
        labels: [row.name],
        type: 'line'
      }}
    />
  );
}
