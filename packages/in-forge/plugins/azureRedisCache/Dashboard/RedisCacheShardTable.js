/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import {
  zeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  percentagePlainTwoDecimalPlaces
} from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.azureRedisCache.dashboard.titleShardId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return 'Shard ' + row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureRedisCache.dashboard.titleConnections'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `connectedclients${row.key}`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureRedisCache.dashboard.titleOperationsPerSec'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `operationsPerSecond${row.key}`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureRedisCache.dashboard.titleTotalCommands'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `totalcommandsprocessed${row.key}`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },

  {
    title: t('in-forge:plugins.azureRedisCache.dashboard.titleCPU'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `percentProcessorTime${row.key}`;
      },
      getContent: percentagePlainTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureRedisCache.dashboard.titleLoad'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `serverLoad${row.key}`;
      },
      getContent: percentagePlainTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureRedisCache.dashboard.titleTotalKeys'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `totalkeys${row.key}`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureRedisCache.dashboard.titleUsedMemoryTable'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `usedmemory${row.key}`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureRedisCache.dashboard.titleUsedMemoryRSS'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `usedmemoryRss${row.key}`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  }
];

export default function ShardTable({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const shardCount = data.get('shardCount');

  if (shardCount === undefined || shardCount == 0) {
    return null;
  }

  const snapshotId = snapshot.get('id');
  const shardIds = Array.apply(null, { length: shardCount }).map(Function.call, String);
  const rows = shardIds.map(key => {
    return { key, timeConfig, snapshotId };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table withoutPadding cardTitle={`Shards (${rows.length})`} cols={cols} rows={rows} getRowDetails={getRowDetails} />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytesTwoDecimalPlaces,
          metrics: ['cacheRead' + row.key, 'cacheWrite' + row.key],
          labels: [
            t('in-forge:plugins.azureRedisCache.dashboard.labelCacheRead'),
            t('in-forge:plugins.azureRedisCache.dashboard.labelCacheWrite')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['cachehits' + row.key, 'cachemisses' + row.key],
          labels: [
            t('in-forge:plugins.azureRedisCache.dashboard.labelCacheHits'),
            t('in-forge:plugins.azureRedisCache.dashboard.labelCacheMisses')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['getcommands' + row.key, 'setcommands' + row.key],
          labels: [
            t('in-forge:plugins.azureRedisCache.dashboard.labelGets'),
            t('in-forge:plugins.azureRedisCache.dashboard.labelSets')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['expiredkeys' + row.key, 'evictedkeys' + row.key],
          labels: [
            t('in-forge:plugins.azureRedisCache.dashboard.labelKeysExpired'),
            t('in-forge:plugins.azureRedisCache.dashboard.labelKeysEvicted')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
