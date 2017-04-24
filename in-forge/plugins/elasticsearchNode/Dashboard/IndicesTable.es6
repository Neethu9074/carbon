import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Table from 'in-sdk/components/dashboard/Table';
import {
  withSiMultiplyPrefixZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';

const cols = [
  {
    title: 'Index',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Documents',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.document_count`;
      },
      getContent: withSiMultiplyPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Deleted',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.deleted_count`;
      },
      getContent: withSiMultiplyPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.size`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function IndicesTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot.getIn(['data', 'index.names'], emptyList).toArray().map(name => {
    return {
      key: name,
      name,
      timeframe,
      snapshotId
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Indices (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <ChartWithLegend
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 80,
        right: 80
      }}
      y1={{
        metrics: ['index.' + row.name + '.document_count', 'index.' + row.name + '.deleted_count'],
        labels: ['Documents', 'Deletions'],
        formatter: withSiMultiplyPrefixZeroDecimalPlaces,
        tooltipFormatter: zeroDecimalPlaces,
        type: 'line'
      }}
      y2={{
        metrics: ['index.' + row.name + '.size'],
        labels: ['Size'],
        formatter: bytesTwoDecimalPlaces,
        type: 'line'
      }}
    />
  );
}
