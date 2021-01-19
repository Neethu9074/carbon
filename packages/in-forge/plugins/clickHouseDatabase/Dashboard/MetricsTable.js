/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import metrics from 'in-forge/plugins/clickHouseDatabase/Dashboard/metrics';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Metric',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.metric;
      }
    }
  },
  {
    title: 'Value',
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
  const rows = metrics.map(metric => ({
    key: metric.metric,
    snapshotId: snapshot.get('id'),
    timeConfig,
    ...metric
  }));

  return (
    <Table
      withoutPadding
      cardTitle="Metrics"
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
