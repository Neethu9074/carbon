import React from 'react';

import { withSiPrefixThreeDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

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
        return `metrics.timers.${row.name}.rate`;
      },
      getContent: rateFormatter,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Mean',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.timers.${row.name}.mean`;
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
  const rows = snapshot.getIn(['data', 'metrics.timers'], emptyList).toArray().map(name => {
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
    <DashboardSection title={`Timers (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} maxItemsPerPage={20} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <ChartWithLegend
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 90,
        right: 90
      }}
      y1={{
        formatter: rateFormatter,
        metrics: ['metrics.timers.' + row.name + '.rate'],
        labels: ['rate'],
        type: 'line'
      }}
      y2={{
        formatter: timeByMillisTwoDecimalPlaces,
        metrics: [
          'metrics.timers.' + row.name + '.mean',
          'metrics.timers.' + row.name + '.50th',
          'metrics.timers.' + row.name + '.99th'
        ],
        labels: ['mean', '50th', '99th'],
        type: 'line'
      }}
    />
  );
}
