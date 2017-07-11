import React from 'react';

import { withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.monitorName;
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
        return 'monitor.' + row.monitorName;
      },
      getContent: withSiPrefixThreeDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CustomMonitorsTable({ snapshot, timeframe }) {
  const monitors = snapshot.getIn(['data', 'monitor'], emptyList);
  if (monitors.size === 0) {
    return null;
  }

  const rows = monitors.map(name => {
    return {
      key: name,
      timeframe,
      monitorName: name,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <DashboardSection title={`Custom Monitors (${monitors.size})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 90
      }}
      y1={{
        formatter: withSiPrefixThreeDecimalPlaces,
        metrics: ['monitor.' + row.monitorName],
        labels: [row.monitorName],
        type: 'line'
      }}
    />
  );
}
