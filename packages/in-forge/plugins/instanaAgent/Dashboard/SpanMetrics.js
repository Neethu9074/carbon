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
import { t } from 'in-i18n';

const cols = [
  {
    id: 'pid',
    title: t('in-forge:plugins.instanaAgent.dashboard.pid'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    id: 'so',
    title: t('in-forge:plugins.instanaAgent.dashboard.spansOpened'),
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
    title: t('in-forge:plugins.instanaAgent.dashboard.spansClosed'),
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
    title: t('in-forge:plugins.instanaAgent.dashboard.spansFiltered'),
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
    title: t('in-forge:plugins.instanaAgent.dashboard.spansDropped'),
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
      cardTitle={t('in-forge:plugins.instanaAgent.dashboard.spanMetrics')}
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
        labels: [
          t('in-forge:plugins.instanaAgent.dashboard.opened'),
          t('in-forge:plugins.instanaAgent.dashboard.closed'),
          t('in-forge:plugins.instanaAgent.dashboard.filtered'),
          t('in-forge:plugins.instanaAgent.dashboard.dropped')
        ],
        type: 'line'
      }}
      y2={{
        min: 0,
        max: 1,
        formatter: number.detailed,
        metrics: ['pid.' + row.key + '.fr'],
        labels: [t('in-forge:plugins.instanaAgent.dashboard.filterRate')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
