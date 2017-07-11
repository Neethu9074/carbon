import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces, bytes } from 'in-services/formatters/number';
import { yesOrNo } from 'in-services/formatters/boolean';
import Chart from 'in-components/Chart';
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
    title: 'All Failed Tasks',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.failedTasks';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'All Completed Tasks',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.completedTasks';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Total Input Bytes',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.inputBytes';
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Total Shuffle Read',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.shuffleRead';
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Total Shuffle Write',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.shuffleWrite';
      },
      getContent: bytes.detailed,
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
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['executors.' + row.key + '.completedTasks', 'executors.' + row.key + '.failedTasks'],
          labels: ['All Completed Tasks', 'All Failed Tasks'],
          type: 'line'
        }}
      />
      <Chart
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
      <Chart
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
      <Chart
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
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: bytes.compact,
          tooltipFormatter: bytes.detailed,
          metrics: ['executors.' + row.key + '.inputBytes'],
          labels: ['Total Input Bytes'],
          type: 'line'
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: bytes.compact,
          tooltipFormatter: bytes.detailed,
          metrics: ['executors.' + row.key + '.shuffleRead', 'executors.' + row.key + '.shuffleWrite'],
          labels: ['Total Shuffle Read', 'Total Shuffle Write'],
          type: 'line'
        }}
      />
    </div>
  );
}
