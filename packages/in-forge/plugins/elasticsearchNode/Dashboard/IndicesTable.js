/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { bytes, millis, number, withSiMultiplyPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.elasticsearchNode.dashboard.index'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.elasticsearchNode.dashboard.documents'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.document_count`;
      },
      getContent: withSiMultiplyPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.elasticsearchNode.dashboard.deleted'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.deleted_count`;
      },
      getContent: withSiMultiplyPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.elasticsearchNode.dashboard.size'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.size`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function IndicesTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const extendedMetrics = snapshot.getIn(['data', 'displayDetailedIndexMetrics'], false);

  const rows = snapshot
    .getIn(['data', 'index.names'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        name,
        timeConfig,
        snapshotId,
        extendedMetrics
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.elasticsearchNode.dashboard.indicesWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          metrics: ['index.' + row.name + '.document_count', 'index.' + row.name + '.deleted_count'],
          labels: [
            t('in-forge:plugins.elasticsearchNode.dashboard.documents'),
            t('in-forge:plugins.elasticsearchNode.dashboard.deletions')
          ],
          formatter: withSiMultiplyPrefixZeroDecimalPlaces,
          tooltipFormatter: number.compact,
          type: 'line'
        }}
        y2={{
          metrics: ['index.' + row.name + '.size'],
          labels: [t('in-forge:plugins.elasticsearchNode.dashboard.size')],
          formatter: bytes.detailed,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      {row.extendedMetrics && (
        <div>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              metrics: [
                'index.' + row.name + '.query_current',
                'index.' + row.name + '.query_total',
                'index.' + row.name + '.fetch_current',
                'index.' + row.name + '.fetch_count'
              ],
              labels: [
                t('in-forge:plugins.elasticsearchNode.dashboard.queriesCurrent'),
                t('in-forge:plugins.elasticsearchNode.dashboard.queriesTotal'),
                t('in-forge:plugins.elasticsearchNode.dashboard.fetchesCurrent'),
                t('in-forge:plugins.elasticsearchNode.dashboard.fetchesTotal')
              ],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />

          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              metrics: ['index.' + row.name + '.query_time', 'index.' + row.name + '.fetch_time'],
              labels: [
                t('in-forge:plugins.elasticsearchNode.dashboard.queryTime'),
                t('in-forge:plugins.elasticsearchNode.dashboard.fetchTime')
              ],
              formatter: millis.detailed,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <Columize>
            <Chart
              snapshotId={row.snapshotId}
              timeConfig={row.timeConfig}
              y1={{
                metrics: ['index.' + row.name + '.query_cache_size', 'index.' + row.name + '.request_cache_size'],
                labels: [
                  t('in-forge:plugins.elasticsearchNode.dashboard.queryCacheMemory'),
                  t('in-forge:plugins.elasticsearchNode.dashboard.requestCacheMemory')
                ],
                formatter: bytes.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
            <Chart
              snapshotId={row.snapshotId}
              timeConfig={row.timeConfig}
              y1={{
                metrics: [
                  'index.' + row.name + '.query_cache_evictions',
                  'index.' + row.name + '.request_cache_evictions'
                ],
                labels: [
                  t('in-forge:plugins.elasticsearchNode.dashboard.queryCacheEvictions'),
                  t('in-forge:plugins.elasticsearchNode.dashboard.requestCacheEvictions')
                ],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Columize>
          <Columize>
            <Chart
              snapshotId={row.snapshotId}
              timeConfig={row.timeConfig}
              y1={{
                metrics: ['index.' + row.name + '.get_count'],
                labels: [t('in-forge:plugins.elasticsearchNode.dashboard.getRequestsTotalCount')],
                formatter: number.compact,
                type: 'line'
              }}
              y2={{
                metrics: ['index.' + row.name + '.get_time'],
                labels: [t('in-forge:plugins.elasticsearchNode.dashboard.getRequestsTime')],
                formatter: millis.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
            <Chart
              snapshotId={row.snapshotId}
              timeConfig={row.timeConfig}
              y1={{
                metrics: ['index.' + row.name + '.missing_count'],
                labels: [t('in-forge:plugins.elasticsearchNode.dashboard.getRequestsFailedCount')],
                formatter: number.compact,
                type: 'line'
              }}
              y2={{
                metrics: ['index.' + row.name + '.missing_time'],
                labels: [t('in-forge:plugins.elasticsearchNode.dashboard.getRequestsFailedTime')],
                formatter: millis.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Columize>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              metrics: ['index.' + row.name + '.failed'],
              labels: [t('in-forge:plugins.elasticsearchNode.dashboard.indexingOperationsFailed')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <Columize>
            <Chart
              snapshotId={row.snapshotId}
              timeConfig={row.timeConfig}
              y1={{
                metrics: ['index.' + row.name + '.merge_current'],
                labels: [t('in-forge:plugins.elasticsearchNode.dashboard.currentMergesCount')],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
            <Chart
              snapshotId={row.snapshotId}
              timeConfig={row.timeConfig}
              y1={{
                metrics: ['index.' + row.name + '.merge_size'],
                labels: [t('in-forge:plugins.elasticsearchNode.dashboard.totalMergesSize')],
                formatter: bytes.detailed,
                type: 'line'
              }}
              y2={{
                metrics: ['index.' + row.name + '.merge_time'],
                labels: [t('in-forge:plugins.elasticsearchNode.dashboard.totalMergesTime')],
                formatter: millis.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Columize>
        </div>
      )}
    </div>
  );
}
