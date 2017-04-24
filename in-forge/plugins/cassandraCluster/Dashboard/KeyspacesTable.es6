import React from 'react';

import { bytesTwoDecimalPlaces, number } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Replication Factor',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'keyspacesInfo', row.key, 'replicationFactor']);
      },
      getContent: number.compact
    }
  },
  {
    title: 'Disk Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `keyspace.${row.key}.diskSize`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function KeyspacesTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot.getIn(['data', 'keyspaces'], emptyList).toArray().map(name => {
    return {
      key: name,
      snapshot,
      snapshotId,
      timeframe
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Keyspace Details (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <ChartWithLegend
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 80,
        right: 80
      }}
      y1={{
        metrics: ['keyspace.' + row.key + '.diskSize'],
        labels: ['Disk Size'],
        formatter: bytesTwoDecimalPlaces,
        tooltipFormatter: bytesTwoDecimalPlaces,
        type: 'line'
      }}
    />
  );
}
