/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, millis } from 'in-services/formatters/number';
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
    title: t('in-forge:plugins.db2Database.pctTotRr'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `toptotalstmts.${row.key}.pctTotRr`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.pctTotCpu'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `toptotalstmts.${row.key}.pctTotCpu`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.totalCpuTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `toptotalstmts.${row.key}.totalCpuTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.stmtExecTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `toptotalstmts.${row.key}.stmtExecTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.pctStmtExecTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `toptotalstmts.${row.key}.pctStmtExecTime`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function TopTotalStmtsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'toptotalstmtsid'], emptyList)
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
      cardTitle={t('in-forge:plugins.db2Database.dashboard.toptotalcpu')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <div>
      <Code code={formatSql(row.snapshot.getIn(['data', 'toptotalstmts.' + row.key + '.stmText']))} lang="sql" />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: number.detailed,
          metrics: ['toptotalstmts.' + row.key + '.rowsRead', 'toptotalstmts.' + row.key + '.numExecutions'],
          labels: [t('in-forge:plugins.db2Database.rowsRead'), t('in-forge:plugins.db2Database.numExecutions')],
          type: 'line'
        }}
        y2={{
          min: 0,
          metrics: [
            'toptotalstmts.' + row.key + '.pctTotRr',
            'toptotalstmts.' + row.key + '.pctTotCpu',
            'toptotalstmts.' + row.key + '.pctNumExec'
          ],
          labels: [
            t('in-forge:plugins.db2Database.pctTotRr'),
            t('in-forge:plugins.db2Database.pctTotCpu'),
            t('in-forge:plugins.db2Database.pctNumExec')
          ],
          type: 'line',
          formatter: number.compact
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: millis.detailed,
          metrics: ['toptotalstmts.' + row.key + '.totalCpuTime', 'toptotalstmts.' + row.key + '.stmtExecTime'],
          labels: [t('in-forge:plugins.db2Database.totalCpuTime'), t('in-forge:plugins.db2Database.stmtExecTime')],
          type: 'line'
        }}
        y2={{
          min: 0,
          metrics: ['toptotalstmts.' + row.key + '.pctStmtExecTime'],
          labels: [t('in-forge:plugins.db2Database.pctStmtExecTime')],
          type: 'line',
          formatter: number.compact
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
