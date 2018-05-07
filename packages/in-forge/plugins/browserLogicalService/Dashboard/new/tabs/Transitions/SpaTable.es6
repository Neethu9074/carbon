import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import Chart from 'in-components/Chart';
import { number, zeroDecimalPlaces, millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import Title from 'in-components/Title';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.label;
      }
    }
  },
  {
    title: 'Views',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName(row) {
        return `${row.metricPrefix}pt`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  },
  {
    title: 'Transition Time',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName(row) {
        return `${row.metricPrefix}pt.mean`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      },
      forceTimeWindowAggregation: true
    }
  }
];

export default function SpaTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const hashes = snapshot.getIn(['data', 'service_endpoint_hashes']);
  const rows = [];

  snapshot
    .getIn(['data', 'service_endpoints'])
    .toArray()
    .forEach((pageName, i) => {
      // protect against missing data
      if (!hashes || !hashes.get(i)) {
        return;
      }

      const pageHash = hashes.get(i);

      rows.push({
        key: pageHash,
        label: pageName,
        metricPrefix: `endpoint.${pageName}.`,
        snapshot,
        pageHash,
        timeConfig: timeConfig,
        snapshotId: snapshotId
      });
    });

  return (
    <MaxWidthFullscreenContainer>
      <Title title="SPA Transitions" />
      <DashboardTile title={`SPA Transitions (${rows.length})`}>
        <Table cols={cols} rows={rows} getRowDetails={getRowDetails} initialSortColumn={0} initialSortDirection="asc" />
      </DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: [`${row.metricPrefix}pt`],
        labels: ['views'],
        type: 'bar',
        aggregation: 'sum'
      }}
      y2={{
        min: 0,
        formatter: millis.detailed,
        metrics: [`${row.metricPrefix}pt.mean`],
        labels: ['transition time'],
        type: 'line',
        aggregation: 'mean'
      }}
    />
  );
}
