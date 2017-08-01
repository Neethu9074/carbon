import React from 'react';

import { timeByMicroTwoDecimalPlaces, bytesZeroDecimalPlaces, number } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const muSecondsFormatter = muSeconds => muSeconds + ' µs';

const cols = [
  {
    title: 'Keyspace',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Reads',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `keyspace.${row.key}.reads`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: 'Avg. Read Latency',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `keyspace.${row.key}.readLatency`;
      },
      getContent: muSecondsFormatter,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Writes',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `keyspace.${row.key}.writes`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: 'Avg. Write Latency',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `keyspace.${row.key}.writeLatency`;
      },
      getContent: muSecondsFormatter,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'SSTables',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `keyspace.${row.key}.ssTables`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Disk Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `keyspace.${row.key}.diskSize`;
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function KeyspacesTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot.getIn(['data', 'keyspaces'], emptyList).toArray().map(name => {
    return {
      key: name,
      timeframe,
      snapshotId
    };
  });

  return (
    <DashboardSection title={`Keyspaces (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 80,
        right: 80
      }}
      y1={{
        min: 0,
        formatter: timeByMicroTwoDecimalPlaces,
        metrics: ['keyspace.' + row.key + '.readLatency', 'keyspace.' + row.key + '.writeLatency'],
        labels: ['Average Read Latency', 'Average Write Latency'],
        type: 'line'
      }}
      y2={{
        min: 0,
        metrics: ['keyspace.' + row.key + '.reads', 'keyspace.' + row.key + '.writes'],
        labels: ['Reads', 'Writes'],
        type: 'line'
      }}
    />
  );
}
