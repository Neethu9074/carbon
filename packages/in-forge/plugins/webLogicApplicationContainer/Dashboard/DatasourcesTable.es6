import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: '',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Available Connections',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.availableConnections';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Connections in Pool',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.connectionsInPool';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Requests Waiting for Connection',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.requestsWaitingForConnection';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Connections Created',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.' + row.key + '.connectionsCreated';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatasourcesTable({ snapshot, timeframe }) {
  const datasourceNames = snapshot.getIn(['data', 'datasourceNames'], emptyList);
  if (datasourceNames.size === 0) {
    return null;
  }

  const rows = datasourceNames.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      timeframe
    };
  });

  return (
    <DashboardSection title={`Database Connection Pools (${rows.length})`}>
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
          metrics: [
            'datasources.' + row.key + '.availableConnections',
            'datasources.' + row.key + '.connectionsInPool',
            'datasources.' + row.key + '.requestsWaitingForConnection',
            'datasources.' + row.key + '.connectionsCreated'
          ],
          labels: [
            'Available Connections',
            'Connections in Pool',
            'Requests Waiting for Connection',
            'Connections Created'
          ],
          type: 'line'
        }}
      />
    </div>
  );
}
