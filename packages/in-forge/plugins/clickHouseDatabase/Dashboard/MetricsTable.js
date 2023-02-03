/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import metrics from 'in-forge/plugins/clickHouseDatabase/metricDefinitions';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleMetric'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.metric;
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleValue'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return row.metric;
      },
      getContent(v, row) {
        return row.formatter.detailed(v);
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function MetricsTable({ snapshot, timeConfig }) {
  const rows = metrics
    // Filter out dynamic metrics which do not define a metric field.
    .filter(metric => metric.metric != null)
    .map(metric => ({
      key: metric.metric,
      snapshotId: snapshot.get('id'),
      timeConfig,
      ...metric
    }));

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.clickhouseDatabase.dashboard.titleMetrics')}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      maxItemsPerPage={10}
    />
  );
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        formatter: row.formatter.detailed,
        metrics: [row.metric],
        labels: [row.metric],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
