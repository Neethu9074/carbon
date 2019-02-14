import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, millis, percentage } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Queue Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queueMetrics.' + row.key + '.queue_size';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Messages Enqueued',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queueMetrics.' + row.key + '.enqueue_count';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Messages Dequeued',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queueMetrics.' + row.key + '.dequeue_count';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Memory Usage',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queueMetrics.' + row.key + '.memory_usage';
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function QueuesTable({ snapshot, timeConfig }) {
  const queues = snapshot.getIn(['data', 'queues'], emptyList);
  if (queues.size === 0) {
    return null;
  }
  const rows = queues
    .map(queue => {
      return {
        key: queue,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    })
    .toArray();
  return (
    <DashboardSection title={`Queues (${rows.length})`}>
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
          metrics: ['queueMetrics.' + id + '.memory_usage'],
          labels: ['Memory Usage'],
          type: 'line',
          formatter: percentage.detailed
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: ['queueMetrics.' + id + '.producer_count', 'queueMetrics.' + id + '.consumer_count'],
          labels: ['Producer Count', 'Consumer Count'],
          type: 'line',
          formatter: number.compact
        }}
      />
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: [
              'queueMetrics.' + id + '.enqueue_count',
              'queueMetrics.' + id + '.dispatch_count',
              'queueMetrics.' + id + '.dequeue_count'
            ],
            labels: ['Enqueue Count', 'Dispatch Count', 'Dequeue Count'],
            type: 'line',
            formatter: number.compact
          }}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: ['queueMetrics.' + id + '.expired_count'],
            labels: ['ExpiredCount'],
            type: 'line',
            formatter: number.detailed
          }}
        />
      </Columize>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: ['queueMetrics.' + id + '.enqueue_time'],
          labels: ['EnqueueTime'],
          type: 'line',
          formatter: millis.detailed
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: ['queueMetrics.' + id + '.queue_size'],
          labels: ['QueueSize'],
          type: 'line',
          formatter: number.compact
        }}
      />
    </div>
  );
}
