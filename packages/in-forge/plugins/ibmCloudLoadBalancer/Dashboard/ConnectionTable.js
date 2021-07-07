/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { bytesPerSecondZeroDecimalPlaces, number, twoDecimalPlacesPerSecond } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudLoadBalancer.applianceId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return isAggregateRow(row) ? t('in-forge:plugins.ibmCloudLoadBalancer.aggregate') : row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudLoadBalancer.activeConnections'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return isAggregateRow(row) ? 'active_connections' : `appliances.${row.name}.active_connections`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudLoadBalancer.connectionRate'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return isAggregateRow(row) ? 'connection_rate' : `appliances.${row.name}.connection_rate`;
      },
      getContent: twoDecimalPlacesPerSecond,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudLoadBalancer.throughput'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return isAggregateRow(row) ? 'throughput' : `appliances.${row.name}.throughput`;
      },
      getContent: bytesPerSecondZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ConnectionTable({ snapshot, timeConfig, applianceIds }) {
  if (!applianceIds || applianceIds.isEmpty()) {
    return null;
  }

  const rows = applianceIds.toArray().map(appliance => {
    return {
      key: appliance,
      name: appliance,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmCloudLoadBalancer.activity')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      maxItemsPerPage={10}
    />
  );
}

function getDetails(row) {
  let rateMetric = `appliances.${row.name}.connection_rate`,
    activeConnectionMetric = `appliances.${row.name}.active_connections`,
    throughputMetric = `appliances.${row.name}.throughput`;

  let valueFormatter = number.compact;

  if (row.name === '_total_') {
    rateMetric = 'connection_rate';
    activeConnectionMetric = 'active_connections';
    throughputMetric = 'throughput';
    valueFormatter = number.detailed;
  }

  return (
    <Columize>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: valueFormatter,
          metrics: [activeConnectionMetric],
          labels: [t('in-forge:plugins.ibmCloudLoadBalancer.activeConnections')],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: twoDecimalPlacesPerSecond,
          metrics: [rateMetric],
          labels: [t('in-forge:plugins.ibmCloudLoadBalancer.connectionRate')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: bytesPerSecondZeroDecimalPlaces,
          metrics: [throughputMetric],
          labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.throughput')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </Columize>
  );
}

function isAggregateRow(row) {
  return row.name === '_total_';
}
