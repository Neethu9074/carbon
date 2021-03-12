/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { zeroDecimalPlaces, msZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleManagedConnectionObjectsInUse'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'connectionPools.' + row.key + '.managedConnectionCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleFreeConnectionsInPool'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'connectionPools.' + row.key + '.freeConnectionCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleConnectionObjectsInUse'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'connectionPools.' + row.key + '.connectionHandleCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleAvgWaitingTimeForConnection'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'connectionPools.' + row.key + '.waitTime';
      },
      getContent: msZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleConnectionsCreated'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'connectionPools.' + row.key + '.connectionsCreated';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ConnectionPoolsTable({ snapshot, timeConfig }) {
  const connectionPoolNames = snapshot.getIn(['data', 'connectionPoolNames'], emptyList);
  if (connectionPoolNames.size === 0) {
    return null;
  }

  const rows = connectionPoolNames.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.webSphereLibertyAppContainer.titleDatabaseConnectionPoolsCount', {
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
            'connectionPools.' + row.key + '.managedConnectionCount',
            'connectionPools.' + row.key + '.freeConnectionCount',
            'connectionPools.' + row.key + '.connectionHandleCount',
            'connectionPools.' + row.key + '.connectionsCreated'
          ],
          labels: [
            t('in-forge:plugins.webSphereLibertyAppContainer.titleManagedConnectionObjectsInUse'),
            t('in-forge:plugins.webSphereLibertyAppContainer.titleFreeConnectionsInPool'),
            t('in-forge:plugins.webSphereLibertyAppContainer.titleConnectionObjectsInUse'),
            t('in-forge:plugins.webSphereLibertyAppContainer.titleConnectionsCreated')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: msZeroDecimalPlaces,
          metrics: ['connectionPools.' + row.key + '.waitTime'],
          labels: [t('in-forge:plugins.webSphereLibertyAppContainer.titleAvgWaitingTimeForConnection')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
