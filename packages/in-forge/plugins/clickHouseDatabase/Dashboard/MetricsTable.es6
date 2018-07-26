import React from 'react';

import metrics from 'in-forge/plugins/clickHouseDatabase/Dashboard/metrics';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart';

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
    <DashboardSection title="Metrics">
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} maxItemsPerPage={25} />
    </DashboardSection>
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
    />
  );
}
