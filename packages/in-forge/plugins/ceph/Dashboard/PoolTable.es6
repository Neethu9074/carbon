import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, bytes } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Pool Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'pools.' + row.key + '.size_bytes';
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Read OPS',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'pools.' + row.key + '.read_ops';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Write OPS',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'pools.' + row.key + '.write_ops';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function PoolTable({ snapshot, timeframe }) {
  const pools = snapshot.getIn(['data', 'poolsListss'], emptyList);
  if (pools.size === 0) {
    return null;
  }
  const rows = pools
    .map(pool => {
      return {
        key: pool,
        timeframe,
        snapshotId: snapshot.get('id')
      };
    })
    .toArray();

  return (
    <DashboardSection title={`Pools (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  const id = row.key;
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        y1={{
          min: 0,
          metrics: [
            'pools.' + id + '.num_objects',
            'pools.' + id + '.num_object_clones',
            'pools.' + id + '.num_object_copies',
            'pools.' + id + '.num_objects_missing_on_primary',
            'pools.' + id + '.num_objects_unfound',
            'pools.' + id + '.num_objects_degraded'
          ],
          labels: ['Total', 'Clones', 'Copies', 'Missing On Primary', 'Unfound', 'Degraded'],
          type: 'line',
          formatter: number.compact
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        y1={{
          min: 0,
          metrics: ['pools.' + id + '.read_ops'],
          labels: ['Read OPS'],
          type: 'line',
          formatter: number.compact
        }}
        y2={{
          min: 0,
          metrics: ['pools.' + id + '.read_bytes'],
          labels: ['Read Bytes'],
          type: 'line',
          formatter: bytes.compact
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        y1={{
          min: 0,
          metrics: ['pools.' + id + '.write_ops'],
          labels: ['Write OPS'],
          type: 'line',
          formatter: number.compact
        }}
        y2={{
          min: 0,
          metrics: ['pools.' + id + '.write_bytes'],
          labels: ['Write Bytes'],
          type: 'line',
          formatter: bytes.compact
        }}
      />
    </div>
  );
}
