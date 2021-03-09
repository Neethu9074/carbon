/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  activityZeroDecimalPlaces,
  hitRateZeroDecimalPlaces,
  zeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.postgreSqlDatabase.dashboard.database'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.postgreSqlDatabase.dashboard.committedTransactions'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.xact_commit';
      },
      getContent: activityZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.postgreSqlDatabase.dashboard.rolledBackTransactions'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.xact_rollback';
      },
      getContent: activityZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.postgreSqlDatabase.dashboard.cacheHitRatio'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.blks_hit_rate';
      },
      getContent: hitRateZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.postgreSqlDatabase.dashboard.standbyConflicts'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.conflicts';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.postgreSqlDatabase.dashboard.tuplesRead'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.idx_tup_read';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.postgreSqlDatabase.dashboard.tuplesFetched'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.idx_tup_fetch';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.postgreSqlDatabase.dashboard.size'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.db_size';
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.postgreSqlDatabase.dashboard.activeConnections'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'databases.' + row.key + '.active_connections';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatabasesTable({ snapshot, timeConfig }) {
  const databases = snapshot
    .getIn(['data', 'dbs'], emptyList)
    .toArray()
    .sort();
  if (databases.size === 0) {
    return null;
  }

  const rows = databases.map(database => {
    return {
      key: database,
      snapshotId: snapshot.get('id'),
      timeConfig,
      snapshot
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.postgreSqlDatabase.dashboard.databases')}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.postgreSqlDatabase.dashboard.transactions')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: activityZeroDecimalPlaces,
              metrics: ['databases.' + row.key + '.xact_commit'],
              labels: [t('in-forge:plugins.postgreSqlDatabase.dashboard.committed')],
              type: 'line'
            }}
            y2={{
              min: 0,
              formatter: activityZeroDecimalPlaces,
              metrics: ['databases.' + row.key + '.xact_rollback'],
              labels: [t('in-forge:plugins.postgreSqlDatabase.dashboard.rolledBack')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.postgreSqlDatabase.dashboard.cache')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              metrics: ['databases.' + row.key + '.blks_hit_rate'],
              labels: [t('in-forge:plugins.postgreSqlDatabase.dashboard.cacheHitRatio')],
              type: 'line',
              formatter: hitRateZeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.postgreSqlDatabase.dashboard.conflicts')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: zeroDecimalPlaces,
              metrics: ['databases.' + row.key + '.conflicts'],
              labels: [t('in-forge:plugins.postgreSqlDatabase.dashboard.standbyConflicts')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.postgreSqlDatabase.dashboard.tuples')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: activityZeroDecimalPlaces,
              metrics: ['databases.' + row.key + '.idx_tup_read', 'databases.' + row.key + '.idx_tup_fetch'],
              labels: [
                t('in-forge:plugins.postgreSqlDatabase.dashboard.read'),
                t('in-forge:plugins.postgreSqlDatabase.dashboard.fetched')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.postgreSqlDatabase.dashboard.databaseSizeTitle')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesTwoDecimalPlaces,
              metrics: ['databases.' + row.key + '.db_size'],
              labels: [t('in-forge:plugins.postgreSqlDatabase.dashboard.size')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.postgreSqlDatabase.dashboard.connections')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: zeroDecimalPlaces,
              metrics: ['databases.' + row.key + '.active_connections'],
              labels: [t('in-forge:plugins.postgreSqlDatabase.dashboard.active')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
