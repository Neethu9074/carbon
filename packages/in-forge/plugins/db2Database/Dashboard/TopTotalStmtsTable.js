/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number, millis, micros, percentage } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

let snapshotProps = {};
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
      getContent: percentage.detailed,
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
      getContent: percentage.detailed,
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
      getContent: micros.detailed,
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
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

function TopTotalStmtsTable({ data, keys }) {
  if (!data) {
    return null;
  }
  if (!keys) {
    return null;
  }

  const { snapshot, snapshotId, timeConfig } = snapshotProps;
  const statements = data.get('raw_payload', []);
  const rows = keys
    .get('raw_payload', [])
    .toArray()
    .map(key => {
      return {
        key: key,
        snapshotId,
        timeConfig,
        snapshot,
        value: statements.get(key)
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

export default connectTo(props => {
  snapshotProps = props;
  return {
    data: getRawPayloadWithTimestamp(props.snapshotId, 'toptotalstatements_extracted'),
    keys: getRawPayloadWithTimestamp(props.snapshotId, 'toptotalstmtsid')
  };
}, TopTotalStmtsTable);

function extractQuery(row) {
  return row.value ? formatSql(row.value) : t('in-forge:plugins.db2Database.errorMessage');
}

function getDetails(row) {
  return (
    <div>
      <Code code={extractQuery(row)} lang="sql" softWrap />
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
          formatter: millis.detailed,
          metrics: ['toptotalstmts.' + row.key + '.stmtExecTime'],
          labels: [t('in-forge:plugins.db2Database.stmtExecTime')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: micros.detailed,
          metrics: ['toptotalstmts.' + row.key + '.totalCpuTime'],
          labels: [t('in-forge:plugins.db2Database.totalCpuTime')],
          type: 'line'
        }}
        y2={{
          min: 0,
          metrics: [
            'toptotalstmts.' + row.key + '.pctTotRr',
            'toptotalstmts.' + row.key + '.pctTotCpu',
            'toptotalstmts.' + row.key + '.pctNumExec',
            'toptotalstmts.' + row.key + '.pctStmtExecTime'
          ],
          labels: [
            t('in-forge:plugins.db2Database.pctTotRr'),
            t('in-forge:plugins.db2Database.pctTotCpu'),
            t('in-forge:plugins.db2Database.pctNumExec'),
            t('in-forge:plugins.db2Database.pctStmtExecTime')
          ],
          type: 'line',
          formatter: percentage.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
