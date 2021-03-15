/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Range } from 'immutable';
import React from 'react';

import { bytesTwoDecimalPlaces, zeroDecimalPlaces, zeroDecimalPlacesPerSecond } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.cockroachDBNode.dashboard.titleStoreID'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `storeStatuses.${row.storeNum}.storeId`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: t('in-forge:plugins.cockroachDBNode.dashboard.titleCapacity'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `storeStatuses.${row.storeNum}.capacity`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cockroachDBNode.dashboard.titleAvailable'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `storeStatuses.${row.storeNum}.available`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cockroachDBNode.dashboard.titleUsed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `storeStatuses.${row.storeNum}.used`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cockroachDBNode.dashboard.titleStoreQueries'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `storeStatuses.${row.storeNum}.queriesPerSecond`;
      },
      getContent: zeroDecimalPlacesPerSecond,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cockroachDBNode.dashboard.titleStoreWrites'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `storeStatuses.${row.storeNum}.writesPerSecond`;
      },
      getContent: zeroDecimalPlacesPerSecond,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function StoreTable({ snapshot, timeConfig }) {
  const storeCount = snapshot.getIn(['data', 'store_count'], 1);

  const rows = Range(0, storeCount)
    .toArray()
    .map(storeNum => {
      return {
        key: String(storeNum),
        storeNum,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.cockroachDBNode.dashboard.titleStoreStats')}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <Columize>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: bytesTwoDecimalPlaces,
          metrics: [
            'storeStatuses.' + row.storeNum + '.capacity',
            'storeStatuses.' + row.storeNum + '.available',
            'storeStatuses.' + row.storeNum + '.used'
          ],
          labels: [
            t('in-forge:plugins.cockroachDBNode.dashboard.labelCapacity'),
            t('in-forge:plugins.cockroachDBNode.dashboard.labelAvailable'),
            t('in-forge:plugins.cockroachDBNode.dashboard.labelUsed')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: zeroDecimalPlacesPerSecond,
          metrics: [
            'storeStatuses.' + row.storeNum + '.queriesPerSecond',
            'storeStatuses.' + row.storeNum + '.writesPerSecond'
          ],
          labels: [
            t('in-forge:plugins.cockroachDBNode.dashboard.labelQueries'),
            t('in-forge:plugins.cockroachDBNode.dashboard.labelWrites')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </Columize>
  );
}
