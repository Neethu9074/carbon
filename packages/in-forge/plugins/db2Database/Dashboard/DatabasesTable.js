/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.db2Database.dashboard.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.dashboard.connections'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `databases.${row.key}.connections`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.dashboard.queries'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `databases.${row.key}.queries`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.dashboard.commits'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `databases.${row.key}.commits`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.dashboard.rollbacks'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `databases.${row.key}.rollbacks`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.dashboard.rowsRead'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `databases.${row.key}.rowsReturned`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.dashboard.rowsReturned'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `databases.${row.key}.rowsReturned`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatabasesTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'containerNames'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        snapshotId,
        timeConfig
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.db2Database.dashboard.databasesWithCount', { len: rows.length })}
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
          min: 0,
          metrics: ['databases.' + row.key + '.connections'],
          labels: [t('in-forge:plugins.db2Database.dashboard.count')],
          type: 'line',
          formatter: number.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: number.detailed,
            metrics: ['databases.' + row.key + '.rowsRead', 'databases.' + row.key + '.rowsReturned'],
            labels: [t('in-forge:plugins.db2Database.dashboard.queries')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: number.detailed,
            metrics: ['databases.' + row.key + '.commits', 'databases.' + row.key + '.rollbacks'],
            labels: [
              t('in-forge:plugins.db2Database.dashboard.commits'),
              t('in-forge:plugins.db2Database.dashboard.rollbacks')
            ],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [
            'databases.' + row.key + '.selects',
            'databases.' + row.key + '.updates',
            'databases.' + row.key + '.inserts',
            'databases.' + row.key + '.deletes',
            'databases.' + row.key + '.merges'
          ],
          labels: [
            t('in-forge:plugins.db2Database.dashboard.selects'),
            t('in-forge:plugins.db2Database.dashboard.updates'),
            t('in-forge:plugins.db2Database.dashboard.inserts'),
            t('in-forge:plugins.db2Database.dashboard.deletes'),
            t('in-forge:plugins.db2Database.dashboard.merges')
          ],
          type: 'line',
          formatter: number.compact
        }}
        y2={{
          min: 0,
          metrics: [
            'databases.' + row.key + '.ddls',
            'databases.' + row.key + '.uids',
            'databases.' + row.key + '.xqueries'
          ],
          labels: [
            t('in-forge:plugins.db2Database.dashboard.ddls'),
            t('in-forge:plugins.db2Database.dashboard.uids'),
            t('in-forge:plugins.db2Database.dashboard.xqueries')
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
          formatter: number.detailed,
          metrics: ['databases.' + row.key + '.failedQueries'],
          labels: [t('in-forge:plugins.db2Database.dashboard.failedQueries')],
          type: 'stackedArea'
        }}
        y2={{
          min: 0,
          metrics: ['databases.' + row.key + '.staticQueries', 'databases.' + row.key + '.dynamicQueries'],
          labels: [
            t('in-forge:plugins.db2Database.dashboard.staticQueries'),
            t('in-forge:plugins.db2Database.dashboard.dynamicQueries')
          ],
          type: 'line',
          formatter: number.compact
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
