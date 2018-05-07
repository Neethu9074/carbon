import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import {
  number,
  bytes,
  percentageTwoDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces
} from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Columize from 'in-sdk/components/dashboard/Columize';
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
    title: 'Overall Capacity Usage',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'pools.' + row.key + '.pct_used_pool';
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Number Of Objects',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'pools.' + row.key + '.num_objects_pool';
      },
      getContent: number.compact,
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
        return 'pools.' + row.key + '.read_op_per_sec_pool';
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
        return 'pools.' + row.key + '.write_op_per_sec_pool';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Read',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'pools.' + row.key + '.read_bytes_sec_pool';
      },
      getContent: bytesPerSecondZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Write',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'pools.' + row.key + '.write_bytes_sec_pool';
      },
      getContent: bytesPerSecondZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function PoolTable({ snapshot, timeConfig }) {
  const pools = snapshot.getIn(['data', 'poolsList'], emptyList);
  if (pools.size === 0) {
    return null;
  }
  const rows = pools
    .map(pool => {
      return {
        key: pool,
        timeConfig,
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
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          max: 1,
          metrics: ['pools.' + id + '.pct_used_pool'],
          labels: ['Overall Capacity Usage'],
          type: 'line',
          formatter: percentageTwoDecimalPlaces
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: ['pools.' + id + '.num_objects_pool'],
          labels: ['Number Of Objects'],
          type: 'line',
          formatter: number.compact
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: ['pools.' + id + '.read_bytes_pool'],
          labels: ['Read'],
          type: 'line',
          formatter: bytes.compact
        }}
        y2={{
          min: 0,
          metrics: ['pools.' + id + '.write_bytes_pool'],
          labels: ['Write'],
          type: 'line',
          formatter: bytes.compact
        }}
      />
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: ['pools.' + id + '.read_bytes_sec_pool'],
            labels: ['Read'],
            type: 'line',
            formatter: bytesPerSecondZeroDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['pools.' + id + '.write_bytes_sec_pool'],
            labels: ['Write'],
            type: 'line',
            formatter: bytesPerSecondZeroDecimalPlaces
          }}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: ['pools.' + id + '.read_op_per_sec_pool'],
            labels: ['Read OPS'],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['pools.' + id + '.write_op_per_sec_pool'],
            labels: ['Write OPS'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </Columize>
    </div>
  );
}
