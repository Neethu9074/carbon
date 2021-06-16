/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { number, millis, percentage } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.db2Database.executableId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.totalActTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `logdiskwait.${row.key}.totalActTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.pctTotActTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `logdiskwait.${row.key}.pctTotActTime`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.totalActWaitTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `logdiskwait.${row.key}.totalActWaitTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.pctTotalActWt'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `logdiskwait.${row.key}.pctTotalActWt`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.logDiskWaitTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `logdiskwait.${row.key}.logDiskWaitTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.logDiskWaitsTotal'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `logdiskwait.${row.key}.logDiskWaitsTotal`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.pctDiskWtTotalExec'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `logdiskwait.${row.key}.pctDiskWtTotalExec`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];
export default function LogDiskWaitTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'logdiskwaitid'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        snapshotId,
        timeConfig,
        snapshot
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.db2Database.dashboard.logdiskwait')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <div>
      <Code
        code={formatSql(row.snapshot.getIn(['data', 'logdiskwait.' + row.key + '.stmtText']))}
        lang="sql"
        softWrap
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: millis.detailed,
          metrics: ['logdiskwait.' + row.key + '.totalActTime', 'logdiskwait.' + row.key + '.totalActWaitTime'],
          labels: [t('in-forge:plugins.db2Database.totalActTime'), t('in-forge:plugins.db2Database.totalActWaitTime')],
          type: 'line'
        }}
        y2={{
          min: 0,
          metrics: ['logdiskwait.' + row.key + '.pctTotActTime', 'logdiskwait.' + row.key + '.pctTotalActWt'],
          labels: [t('in-forge:plugins.db2Database.pctTotActTime'), t('in-forge:plugins.db2Database.pctTotalActWt')],
          type: 'line',
          formatter: percentage.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: millis.detailed,
          metrics: ['logdiskwait.' + row.key + '.logDiskWaitsTotal', 'logdiskwait.' + row.key + '.logBufferWaitTime'],
          labels: [
            t('in-forge:plugins.db2Database.logDiskWaitsTotal'),
            t('in-forge:plugins.db2Database.logBufferWaitTime')
          ],
          type: 'line'
        }}
        y2={{
          min: 0,
          metrics: ['logdiskwait.' + row.key + '.pctDiskWtTotalExec'],
          labels: [t('in-forge:plugins.db2Database.pctDiskWtTotalExec')],
          type: 'line',
          formatter: percentage.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
