import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Queue',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Messages ready',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queue_map.' + row.key + '.messages_ready';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Messages unacknowledged',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queue_map.' + row.key + '.messages_unacknowledged';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Messages total',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queue_map.' + row.key + '.messages';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function QueuesTable({ snapshot, timeframe }) {
  const queues = snapshot.getIn(['data', 'monitoredQueues'], emptyList).toArray().sort();
  if (queues.length === 0) {
    return null;
  }

  const rows = queues.map(queue => {
    return {
      key: queue,
      timeframe,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <DashboardSection title={`Queues (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeframe = row.timeframe;

  return (
    <div>
      <ChartWithLegend
        snapshotId={snapshotId}
        timeframe={timeframe}
        margins={{
          left: 80
        }}
        y1={{
          metrics: ['queue_map.' + row.key + '.messages_ready', 'queue_map.' + row.key + '.messages_unacknowledged'],
          labels: ['Messages ready', 'Messages unacknowledged'],
          type: 'stackedArea',
          formatter: zeroDecimalPlaces
        }}
        y2={{
          metrics: ['queue_map.' + row.key + '.messages'],
          labels: ['Messages total'],
          type: 'line',
          formatter: zeroDecimalPlaces
        }}
      />
    </div>
  );
}
