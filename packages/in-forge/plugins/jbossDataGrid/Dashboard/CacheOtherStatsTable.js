/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, hitRate } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.jbossDataGrid.cacheName'),
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
    title: t('in-forge:plugins.jbossDataGrid.cachePuts'),
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
    title: t('in-forge:plugins.jbossDataGrid.readWriteRatio'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `cachesStatistics.${row.key}.readWriteRatioV2`;
      },
      getContent: hitRate.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jbossDataGrid.entries'),
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
    title: t('in-forge:plugins.jbossDataGrid.evictions'),
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
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.jbossDataGrid.otherCacheStatistics')}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: number.compact,
          metrics: ['cachesStatistics.' + row.key + '.stores'],
          labels: [t('in-forge:plugins.jbossDataGrid.cachePuts')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: hitRate.compact,
          tooltipFormatter: hitRate.detailed,
          metrics: ['cachesStatistics.' + row.key + '.readWriteRatioV2'],
          labels: [t('in-forge:plugins.jbossDataGrid.readWriteRatio')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: number.compact,
          metrics: ['cachesStatistics.' + row.key + '.numberOfEntries'],
          labels: [t('in-forge:plugins.jbossDataGrid.entries')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: number.compact,
          metrics: ['cachesStatistics.' + row.key + '.evictions'],
          labels: [t('in-forge:plugins.jbossDataGrid.evictions')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
