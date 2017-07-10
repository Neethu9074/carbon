import React from 'react';

import { zeroDecimalPlaces, msZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart'
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
    title: 'Pool Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.poolSize';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Free Connections in Pool',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.poolSize';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Threads Waiting for Connection',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.poolSize';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Average Waiting Time',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.poolSize';
      },
      getContent: msZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatasourcesTable({ snapshot, timeframe }) {
  const datasources = snapshot.getIn(['data', 'datasourceNames'], emptyList);
  if (datasources.size === 0) {
    return null;
  }

  const rows = datasources.toArray().map(datasource => {
    return {
      key: datasource,
      snapshotId: snapshot.get('id'),
      timeframe
    };
  });

  return (
    <DashboardSection title={`Datasources (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['datasources.' + row.key + '.poolSize', 'datasources.' + row.key + '.freePoolSize'],
          labels: ['Pool Size', 'Free Connections in Pool'],
          type: 'line'
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80,
          right: 40
        }}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['datasources.' + row.key + '.waitingThreadCount'],
          labels: ['Threads Waiting for Connection'],
          type: 'line'
        }}
        y2={{
          formatter: msZeroDecimalPlaces,
          metrics: ['datasources.' + row.key + '.averageWaitTime'],
          labels: ['Average Waiting Time'],
          type: 'line'
        }}
      />
    </div>
  );
}
