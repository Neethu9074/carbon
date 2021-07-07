/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { number, twoDecimalPlacesPerSecond } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudIsLoadBalancer.applianceId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return isAggregateRow(row) ? t('in-forge:plugins.ibmCloudIsLoadBalancer.aggregate') : row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudIsLoadBalancer.activeConnections'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return isAggregateRow(row) ? 'active_connections' : `appliances.${row.name}.active_connections`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudIsLoadBalancer.connectionRate'),
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
      cardTitle={t('in-forge:plugins.ibmCloudIsLoadBalancer.connections')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      maxItemsPerPage={10}
    />
  );
}

function getDetails(row) {
  let rateMetric = `appliances.${row.name}.connection_rate`,
    activeConnectionMetric = `appliances.${row.name}.active_connections`;

  if (isAggregateRow(row)) {
    rateMetric = 'connection_rate';
    activeConnectionMetric = 'active_connections';
  }

  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: [activeConnectionMetric],
        labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.activeConnections')],
        type: 'line'
      }}
      y2={{
        min: 0,
        formatter: twoDecimalPlacesPerSecond,
        metrics: [rateMetric],
        labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.connectionRate')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function isAggregateRow(row) {
  return row.name === '_total_';
}
