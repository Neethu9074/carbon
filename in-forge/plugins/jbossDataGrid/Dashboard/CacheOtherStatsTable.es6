import React from 'react';

import { number, percentage } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart';
import { emptyMap } from 'in-services/fixedImmutables';

const cols = [
  {
    title: 'Cache Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: 'Cache Puts',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cachesStatistics.${row.key}.stores`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Read/Write Ratio',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cachesStatistics.${row.key}.readWriteRatio`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Entries',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cachesStatistics.${row.key}.numberOfEntries`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Evictions',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cachesStatistics.${row.key}.evictions`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CacheStatisticsTable({ snapshot, timeframe }) {
  const caches = snapshot
    .getIn(['data', 'caches'], emptyMap)
    .filter(cacheInfo => cacheInfo.get('statisticsEnabled') === true)
    .keySeq()
    .toArray();

  if (caches.size === 0) {
    return null;
  }

  const rows = caches.map(cache => {
    return {
      key: cache,
      timeframe,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <DashboardSection title="Other Cache Statistics">
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
          formatter: number.compact,
          metrics: ['cachesStatistics.' + row.key + '.stores'],
          labels: ['Cache Puts'],
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
          formatter: percentage.compact,
          tooltipFormatter: percentage.detailed,
          metrics: ['cachesStatistics.' + row.key + '.readWriteRatio'],
          labels: ['Read/Write Ratio'],
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
          formatter: number.compact,
          metrics: ['cachesStatistics.' + row.key + '.numberOfEntries'],
          labels: ['Entries'],
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
          formatter: number.compact,
          metrics: ['cachesStatistics.' + row.key + '.evictions'],
          labels: ['Evictions'],
          type: 'line'
        }}
      />
    </div>
  );
}
