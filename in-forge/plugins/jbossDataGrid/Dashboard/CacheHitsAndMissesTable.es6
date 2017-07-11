import React from 'react';

import { zeroDecimalPlaces, percentage } from 'in-services/formatters/number';
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
    title: 'Hit Ratio',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cachesStatistics.${row.key}.hitRatio`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Hits',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cachesStatistics.${row.key}.hits`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Misses',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cachesStatistics.${row.key}.misses`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Remove Hits',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cachesStatistics.${row.key}.removeHits`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Remove Misses',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cachesStatistics.${row.key}.removeMisses`;
      },
      getContent: zeroDecimalPlaces,
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
    <DashboardSection title="Cache Hits And Misses">
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
          formatter: percentage.compact,
          tooltipFormatter: percentage.detailed,
          metrics: ['cachesStatistics.' + row.key + '.hitRatio'],
          labels: ['Hit Ratio'],
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
          metrics: [
            'cachesStatistics.' + row.key + '.hits',
            'cachesStatistics.' + row.key + '.misses',
            'cachesStatistics.' + row.key + '.removeHits',
            'cachesStatistics.' + row.key + '.removeMisses'
          ],
          labels: ['Hits', 'Misses', 'Remove Hits', 'Remove Misses'],
          type: 'line'
        }}
      />
    </div>
  );
}
