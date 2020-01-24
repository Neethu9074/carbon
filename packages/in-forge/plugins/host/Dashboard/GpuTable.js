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
        return row.gpuNumber;
      },
      getContent(gpuNumber) {
        return `GPU ${gpuNumber}`;
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
        return `gpus.${row.gpuNumber}.usage`;
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
        return `gpus.${row.gpuNumber}.memoryUsed`;
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
        return `gpus.${row.gpuNumber}.encoder`;
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
        return `gpus.${row.gpuNumber}.decoder`;
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
        return `gpus.${row.gpuNumber}.temperature`;
      },
      getContent: temperature.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function GpuTable({ snapshot, timeConfig }) {
  const gpuCount = snapshot.getIn(['data', 'gpu.count'], 0);
  if (gpuCount < 1) {
    return null;
  }

  const rows = Range(1, gpuCount + 1)
    .toArray()
    .map(gpuNumber => {
      return {
        key: String(gpuNumber),
        gpuNumber: gpuNumber,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    });

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
            metrics: ['gpus.${gpuNumber}.gpuUsage'],
            labels: ['Usage'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: temperature.compact,
            metrics: ['gpus.' + row.gpuNumber + '.temperature'],
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
            metrics: ['gpus.' + row.gpuNumber + '.encoder', 'gpus.' + row.gpuNumber + '.decoder'],
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
            metrics: ['gpus.' + row.gpuNumber + '.memoryUsed'],
            labels: ['Memory Used'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: bytes.detailed,
            metrics: ['gpus.' + row.gpuNumber + '.memoryTotal'],
            labels: ['Memory Total'],
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
            metrics: ['gpus.' + row.gpuNumber + '.transmitted', 'gpus.' + row.gpuNumber + '.received'],
            labels: ['Transmitted', 'Received'],
            type: 'stackedArea'
          }}
        />
      </Columize>
    </div>
  );
}
