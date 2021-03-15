/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleSessionName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleLiveSessions'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'sessions.' + row.key + '.live';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleActiveSessions'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'sessions.' + row.key + '.active';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleSessionsCreated'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'sessions.' + row.key + '.created';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleSessionsInvalidated'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'sessions.' + row.key + '.invalidated';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleSessionsInvalidatedByTimeout'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'sessions.' + row.key + '.invalidatedByTimeout';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ConnectionPoolsTable({ snapshot, timeConfig }) {
  const sessionNames = snapshot.getIn(['data', 'sessionStatsNames'], emptyList).sort();
  if (sessionNames.size === 0) {
    return null;
  }

  const rows = sessionNames.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.webSphereLibertyAppContainer.titleSessionsCount', {
        len: rows.length
      })}
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
          formatter: zeroDecimalPlaces,
          metrics: [
            'sessions.' + row.key + '.live',
            'sessions.' + row.key + '.active',
            'sessions.' + row.key + '.created',
            'sessions.' + row.key + '.invalidated',
            'sessions.' + row.key + '.invalidatedByTimeout'
          ],
          labels: [
            t('in-forge:plugins.webSphereLibertyAppContainer.titleLiveSessions'),
            t('in-forge:plugins.webSphereLibertyAppContainer.titleActiveSessions'),
            t('in-forge:plugins.webSphereLibertyAppContainer.titleSessionsCreated'),
            t('in-forge:plugins.webSphereLibertyAppContainer.titleSessionsInvalidated'),
            t('in-forge:plugins.webSphereLibertyAppContainer.titleSessionsInvalidatedByTimeout')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
