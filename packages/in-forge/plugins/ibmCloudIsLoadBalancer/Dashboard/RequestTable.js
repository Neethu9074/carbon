/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { micros, number, bytesPerSecondZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
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
    title: t('in-forge:plugins.ibmCloudIsLoadBalancer.count'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return isAggregateRow(row) ? 'request_count' : `appliances.${row.name}.request_count`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudIsLoadBalancer.throughput'),
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
  },
  {
    title: t('in-forge:plugins.ibmCloudIsLoadBalancer.latency'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return isAggregateRow(row) ? 'request_latency' : `appliances.${row.name}.request_latency`;
      },
      getContent: micros.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function RequestTable({ snapshot, timeConfig, applianceIds }) {
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
      cardTitle={t('in-forge:plugins.ibmCloudIsLoadBalancer.requests')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      maxItemsPerPage={10}
    />
  );
}

function getDetails(row) {
  let countMetric = `appliances.${row.name}.request_count`,
    latencyMetric = `appliances.${row.name}.request_latency`,
    throughputMetric = `appliances.${row.name}.throughput`;

  if (row.name === '_total_') {
    countMetric = 'request_count';
    latencyMetric = 'request_latency';
    throughputMetric = 'throughput';
  }

  return (
    <Columize>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: number.compact,
          metrics: [countMetric],
          labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.count')],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: bytesPerSecondZeroDecimalPlaces,
          metrics: [throughputMetric],
          labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.throughput')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: micros.detailed,
          metrics: [latencyMetric],
          labels: [t('in-forge:plugins.ibmCloudIsLoadBalancer.latency')],
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
