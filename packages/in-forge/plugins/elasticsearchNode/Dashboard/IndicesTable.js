/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { bytes, millis, number, withSiMultiplyPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Columize from 'in-sdk/components/dashboard/Columize';

const cols = [
  {
    title: 'Index',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Documents',
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
    title: 'Deleted',
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
    title: 'Size',
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
    <Table withoutPadding cardTitle={`Indices (${rows.length})`} cols={cols} rows={rows} getRowDetails={getDetails} />
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
          labels: ['Documents', 'Deletions'],
          formatter: withSiMultiplyPrefixZeroDecimalPlaces,
          tooltipFormatter: number.compact,
          type: 'line'
        }}
        y2={{
          metrics: ['index.' + row.name + '.size'],
          labels: ['Size'],
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
              labels: ['Queries Current', 'Queries Total', 'Fetches Current', 'Fetches Total'],
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
              labels: ['Query Time', 'Fetch Time'],
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
                labels: ['Query Cache Memory', 'Request Cache Memory'],
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
                labels: ['Query Cache Evictions', 'Request Cache Evictions'],
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
                labels: ['Get Requests Total Count'],
                formatter: number.compact,
                type: 'line'
              }}
              y2={{
                metrics: ['index.' + row.name + '.get_time'],
                labels: ['Get Requests Time'],
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
                labels: ['Get Requests Failed Count'],
                formatter: number.compact,
                type: 'line'
              }}
              y2={{
                metrics: ['index.' + row.name + '.missing_time'],
                labels: ['Get Requests Failed Time'],
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
              labels: ['Indexing Operations Failed'],
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
                labels: ['Current Merges Count'],
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
                labels: ['Total Merges Size'],
                formatter: bytes.detailed,
                type: 'line'
              }}
              y2={{
                metrics: ['index.' + row.name + '.merge_time'],
                labels: ['Total Merges Time'],
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
