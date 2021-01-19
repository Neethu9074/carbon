/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    id: 'pid',
    title: 'PID',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    id: 'so',
    title: 'Spans Opened',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pid.${row.key}.so`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  },
  {
    id: 'sc',
    title: 'Spans Closed',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pid.${row.key}.sc`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  },
  {
    id: 'sf',
    title: 'Spans Filtered',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pid.${row.key}.sf`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  },
  {
    id: 'sd',
    title: 'Spans Dropped',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pid.${row.key}.sd`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  }
];

export default function SpanMetrics({ snapshot, timeConfig }) {
  const rows = snapshot
    .getIn(['data', 'pids'], emptyList)
    .map(value => {
      return {
        key: value,
        snapshotId: snapshot.get('id'),
        timeConfig
      };
    })
    .toArray();

  return (
    <Table
      cardTitle="Span Metrics"
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      maxItemsPerPage={10}
    />
  );
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: [
          'pid.' + row.key + '.so',
          'pid.' + row.key + '.sc',
          'pid.' + row.key + '.sf',
          'pid.' + row.key + '.sd'
        ],
        labels: ['Opened', 'Closed', 'Filtered', 'Dropped'],
        type: 'line'
      }}
      y2={{
        min: 0,
        max: 1,
        formatter: number.detailed,
        metrics: ['pid.' + row.key + '.fr'],
        labels: ['Filter Rate'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
