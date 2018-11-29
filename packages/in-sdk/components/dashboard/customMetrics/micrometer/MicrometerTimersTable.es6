import React from 'react';

import { timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart';

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
        return `micrometer.metrics.timer.${row.name}`;
      },
      getContent: timeByMillisTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function MetersTable({ snapshot, timeConfig, titlePrefix }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'micrometer.metrics.timer'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        name,
        snapshotId,
        timeConfig
      };
    });

  if (rows.length === 0) {
    return null;
  }

  const title = (titlePrefix ? titlePrefix : '') + ' Timers (' + rows.length + ')';
  return (
    <DashboardSection title={title}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} maxItemsPerPage={100} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      margins={{
        left: 90,
        right: 90
      }}
      y1={{
        formatter: timeByMillisTwoDecimalPlaces,
        metrics: ['micrometer.metrics.timer.' + row.name],
        labels: ['value'],
        type: 'line'
      }}
    />
  );
}
