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
    title: 'Messages Enqueued',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'topicMetrics.' + row.key + '.enqueue_count';
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
        return 'topicMetrics.' + row.key + '.dequeue_count';
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
        return 'topicMetrics.' + row.key + '.memory_usage';
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function TopicsTable({ snapshot, timeConfig }) {
  const topics = snapshot.getIn(['data', 'topics'], emptyList);
  if (topics.size === 0) {
    return null;
  }
  const rows = topics
    .map(topic => {
      return {
        key: topic,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    })
    .toArray();
  return (
    <DashboardSection title={`Topics (${rows.length})`}>
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
          metrics: ['topicMetrics.' + id + '.memory_usage'],
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
          metrics: ['topicMetrics.' + id + '.producer_count', 'topicMetrics.' + id + '.consumer_count'],
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
              'topicMetrics.' + id + '.enqueue_count',
              'topicMetrics.' + id + '.dispatch_count',
              'topicMetrics.' + id + '.dequeue_count'
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
            metrics: ['topicMetrics.' + id + '.expired_count'],
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
          metrics: ['topicMetrics.' + id + '.enqueue_time'],
          labels: ['EnqueueTime'],
          type: 'line',
          formatter: millis.detailed
        }}
      />
    </div>
  );
}
