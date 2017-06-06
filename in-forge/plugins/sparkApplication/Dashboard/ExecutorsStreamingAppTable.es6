import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import {
  zeroDecimalPlaces,
  bytes,
  zeroDecimalPlacesPerSecond,
  bytesPerSecondZeroDecimalPlaces,
  bytesPerSecondTwoDecimalPlaces
} from 'in-services/formatters/number';
import { yesOrNo } from 'in-services/formatters/boolean';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Id',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Is Active',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.data.get('executors.' + row.key + '.isActive'));
      }
    }
  },
  {
    title: 'RDD Blocks',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.rddBlocks';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Storage Memory',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.memoryUsed';
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Disk Used',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.diskUsed';
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Cores',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.cores';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Failed Tasks per Second',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.failedTasksDelta';
      },
      getContent: zeroDecimalPlacesPerSecond,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Completed Tasks per Second',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.completedTasksDelta';
      },
      getContent: zeroDecimalPlacesPerSecond,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Input Bytes per Second',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.inputBytesDelta';
      },
      getContent: bytesPerSecondTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Shuffle Read per Second',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.shuffleReadDelta';
      },
      getContent: bytesPerSecondTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Shuffle Write per Second',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.shuffleWriteDelta';
      },
      getContent: bytesPerSecondTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ExecutorsTable({ snapshot, timeframe }) {
  const data = snapshot.get('data');
  const executorIds = data.get('executors.idList', emptyList);
  if (executorIds.size === 0) {
    return null;
  }

  const rows = executorIds.toArray().map(key => {
    return {
      key,
      data: data,
      snapshotId: snapshot.get('id'),
      timeframe
    };
  });

  return (
    <DashboardSection title={`Executors (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <ChartWithLegend
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: zeroDecimalPlacesPerSecond,
          metrics: ['executors.' + row.key + '.completedTasksDelta', 'executors.' + row.key + '.failedTasksDelta'],
          labels: ['Completed Tasks per Second', 'Failed Tasks per Second'],
          type: 'line'
        }}
      />
      <ChartWithLegend
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['executors.' + row.key + '.rddBlocks'],
          labels: ['RDD Blocks'],
          type: 'line'
        }}
      />
      <ChartWithLegend
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: bytes.compact,
          tooltipFormatter: bytes.detailed,
          metrics: ['executors.' + row.key + '.memoryUsed', 'executors.' + row.key + '.maxMemory'],
          labels: ['Storage Memory', 'Max Memory'],
          type: 'line'
        }}
      />
      <ChartWithLegend
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: bytes.compact,
          tooltipFormatter: bytes.detailed,
          metrics: ['executors.' + row.key + '.diskUsed'],
          labels: ['Disk Used'],
          type: 'line'
        }}
      />
      <ChartWithLegend
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: bytesPerSecondZeroDecimalPlaces,
          tooltipFormatter: bytesPerSecondTwoDecimalPlaces,
          metrics: ['executors.' + row.key + '.inputBytesDelta'],
          labels: ['Input Bytes per Second'],
          type: 'line'
        }}
      />
      <ChartWithLegend
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: bytesPerSecondZeroDecimalPlaces,
          tooltipFormatter: bytesPerSecondTwoDecimalPlaces,
          metrics: ['executors.' + row.key + '.shuffleReadDelta', 'executors.' + row.key + '.shuffleWriteDelta'],
          labels: ['Shuffle Read per Second', 'Shuffle Write per Second'],
          type: 'line'
        }}
      />
    </div>
  );
}
