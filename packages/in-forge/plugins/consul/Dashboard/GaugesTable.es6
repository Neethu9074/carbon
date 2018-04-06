import React from 'react';

import { withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
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
        return `${row.name}`;
      },
      getContent: withSiPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function Gauges({ snapshot, timeframe, metrics, title }) {
  const snapshotId = snapshot.get('id');
  const rows = metrics.map(name => {
    return {
      key: name,
      name,
      snapshotId,
      timeframe
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`${title} (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} maxItemsPerPage={100} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 90
      }}
      y1={{
        formatter: withSiPrefixZeroDecimalPlaces,
        metrics: [row.name],
        labels: [row.name],
        type: 'line'
      }}
    />
  );
}
