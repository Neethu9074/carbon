import { Range } from 'immutable';
import React from 'react';

import { percentage, number, bytes, temperature } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    id: 'GPU',
    title: 'GPU',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.cpuNumber;
      },
      getContent(cpuNumber) {
        return `GPU ${cpuNumber}`;
      }
    }
  },
  {
    id: 'GPU Usage',
    title: 'GPU Usage',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.user`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'Memory',
    title: 'Memory',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.sys`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'Encoder',
    title: 'Encoder',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.wait`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'Decoder',
    title: 'Decoder',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cpus.${row.cpuNumber}.nice`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'Temperature',
    title: 'Temperature',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `load.1min`;
      },
      getContent: temperature.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CpuTable({ snapshot, timeConfig }) {
  const cpuCount = snapshot.getIn(['data', 'cpu.count'], 1);
  if (cpuCount < 2) {
    return null;
  }

  const rows = Range(1, 3)
    .toArray()
    .map(cpuNumber => {
      return {
        key: String(cpuNumber),
        cpuNumber,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    });

  // typical CPU counts are 2, 4, 8, 16, 32, 64
  // to have evenly filled pages, we use 8 as maxItems instead of default 10
  return (
    <Table
      cardTitle="Individual GPU Usage"
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      maxItemsPerPage={8}
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentage.compact,
            metrics: ['cpus.' + row.cpuNumber + '.user'],
            labels: ['Used'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: temperature.compact,
            metrics: ['load.1min'],
            labels: ['Temperature'],
            type: 'stackedArea'
          }}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentage.compact,
            metrics: ['cpus.' + row.cpuNumber + '.user', 'cpus.' + row.cpuNumber + '.sys'],
            labels: ['Encoder', 'Decoder'],
            type: 'stackedArea'
          }}
        />
      </Columize>
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentage.compact,
            metrics: ['cpus.' + row.cpuNumber + '.user'],
            labels: ['Used'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: bytes.detailed,
            metrics: ['ctxt'],
            labels: ['Total'],
            type: 'stackedArea'
          }}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: number.detailed,
            metrics: ['cpus.' + row.cpuNumber + '.steal', 'cpus.' + row.cpuNumber + '.sys'],
            labels: ['Tx', 'Rx'],
            type: 'stackedArea'
          }}
        />
      </Columize>
    </div>
  );
}
