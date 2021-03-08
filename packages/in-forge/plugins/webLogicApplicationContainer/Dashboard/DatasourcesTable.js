/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.webLogicAppContainer.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.webLogicAppContainer.titleState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.state;
      }
    }
  },
  {
    title: t('in-forge:plugins.webLogicAppContainer.titleAvailable'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.availableConnections';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webLogicAppContainer.titleActive'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.currentActiveConnections';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webLogicAppContainer.titleInPool'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.connectionsInPool';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webLogicAppContainer.titleCreated'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.connectionsCreated';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webLogicAppContainer.titleRequestsWaiting'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.requestsWaitingForConnection';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webLogicAppContainer.titleLeaked'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.leakedConnections';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatasourcesTable({ snapshot, timeConfig }) {
  const datasourceNames = snapshot.getIn(['data', 'datasourceNames'], emptyList);
  if (datasourceNames.size === 0) {
    return null;
  }

  const rows = datasourceNames.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      state: snapshot.getIn(['data', 'datasources.' + key + '.state']),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.webLogicAppContainer.titleDatabaseConnectionPoolsCount', {
        count: rows.length
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
            'datasources.' + row.key + '.availableConnections',
            'datasources.' + row.key + '.currentActiveConnections',
            'datasources.' + row.key + '.connectionsInPool',
            'datasources.' + row.key + '.connectionsCreated',
            'datasources.' + row.key + '.requestsWaitingForConnection',
            'datasources.' + row.key + '.leakedConnections'
          ],
          labels: [
            t('in-forge:plugins.webLogicAppContainer.titleAvailable'),
            t('in-forge:plugins.webLogicAppContainer.titleActive'),
            t('in-forge:plugins.webLogicAppContainer.titleInPool'),
            t('in-forge:plugins.webLogicAppContainer.titleCreated'),
            t('in-forge:plugins.webLogicAppContainer.titleRequestsWaiting'),
            t('in-forge:plugins.webLogicAppContainer.titleLeaked')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
