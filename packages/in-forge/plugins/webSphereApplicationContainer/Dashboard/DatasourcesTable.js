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
    title: t('in-forge:plugins.webSphereAppContainer.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.labelPoolSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.poolSize';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.titleFreeConnectionsInPool'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.freePoolSize';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.titleThreadsWaitingForConnection'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.waitingThreadCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.titleAverageWaitingTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.averageWaitTime';
      },
      getContent: msZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatasourcesTable({ snapshot, timeConfig }) {
  const datasources = snapshot.getIn(['data', 'datasourceNames'], emptyList);
  if (datasources.size === 0) {
    return null;
  }

  const rows = datasources.toArray().map(datasource => {
    return {
      key: datasource,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.webSphereAppContainer.titleDatasourcesCount', {
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
          metrics: ['datasources.' + row.key + '.poolSize', 'datasources.' + row.key + '.freePoolSize'],
          labels: [
            t('in-forge:plugins.webSphereAppContainer.labelPoolSize'),
            t('in-forge:plugins.webSphereAppContainer.titleFreeConnectionsInPool')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['datasources.' + row.key + '.waitingThreadCount'],
          labels: [t('in-forge:plugins.webSphereAppContainer.titleThreadsWaitingForConnection')],
          type: 'line'
        }}
        y2={{
          formatter: msZeroDecimalPlaces,
          metrics: ['datasources.' + row.key + '.averageWaitTime'],
          labels: [t('in-forge:plugins.webSphereAppContainer.titleAverageWaitingTime')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
