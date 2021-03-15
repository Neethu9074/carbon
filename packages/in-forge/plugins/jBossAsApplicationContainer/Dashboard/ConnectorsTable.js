/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { msZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.connector'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.averageResponseTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'connectors.' + row.key + '.avgResponseTime';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.requests'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'connectors.' + row.key + '.requests';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.errors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'connectors.' + row.key + '.errors';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ConnectorsTable({ snapshot, timeConfig }) {
  const connectors = snapshot.getIn(['data', 'connectors'], emptyList).toArray();
  if (connectors.length === 0) {
    return null;
  }

  const rows = connectors.map(key => {
    return {
      key,
      timeConfig,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <Table
      cardTitle={t('in-forge:plugins.jBossAsApplicationContainer.connectorsWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      withoutPadding
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
          formatter: msZeroDecimalPlaces,
          metrics: ['connectors.' + row.key + '.avgResponseTime'],
          labels: [t('in-forge:plugins.jBossAsApplicationContainer.averageResponseTime')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['connectors.' + row.key + '.requests', 'connectors.' + row.key + '.errors'],
          labels: [
            t('in-forge:plugins.jBossAsApplicationContainer.requests'),
            t('in-forge:plugins.jBossAsApplicationContainer.errors')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
