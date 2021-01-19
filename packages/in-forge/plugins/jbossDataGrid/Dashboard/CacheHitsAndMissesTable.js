/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { zeroDecimalPlaces, hitRate } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

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
        return `cachesStatistics.${row.key}.hitRatioV2`;
      },
      getContent: hitRate.compact,
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

export default function CacheStatisticsTable({ snapshot, timeConfig }) {
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
      timeConfig,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <Table withoutPadding cardTitle="Cache Hits And Misses" cols={cols} rows={rows} getRowDetails={getRowDetails} />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: hitRate.compact,
          tooltipFormatter: hitRate.detailed,
          metrics: ['cachesStatistics.' + row.key + '.hitRatioV2'],
          labels: ['Hit Ratio'],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
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
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
