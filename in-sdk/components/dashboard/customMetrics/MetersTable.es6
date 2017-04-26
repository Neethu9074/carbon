import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Table from 'in-sdk/components/dashboard/Table';
import { emptyList } from 'in-services/fixedImmutables';
import { withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';

const rateFormatter = d => withSiPrefixThreeDecimalPlaces(d) + ' / sec';

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
    title: 'Rate',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.meters.${row.name}`;
      },
      getContent: rateFormatter,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function MetersTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot.getIn(['data', 'metrics.meters'], emptyList).toArray().map(name => {
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
    <DashboardSection title={`Meters (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} maxItemsPerPage={100} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <ChartWithLegend
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 90
      }}
      y1={{
        formatter: rateFormatter,
        metrics: ['metrics.meters.' + row.name],
        labels: [row.name + ' rate'],
        type: 'line'
      }}
    />
  );
}
