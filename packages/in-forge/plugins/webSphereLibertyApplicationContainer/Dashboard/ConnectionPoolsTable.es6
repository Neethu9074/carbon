import React from 'react';

import { zeroDecimalPlaces, msZeroDecimalPlaces } from 'in-services/formatters/number';
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
        return row.key;
      }
    }
  },
  {
    title: 'ManagedConnection Objects in Use',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'connectionPools.' + row.key + '.managedConnectionCount';
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
        return 'connectionPools.' + row.key + '.freeConnectionCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Connection Objects in Use',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'connectionPools.' + row.key + '.connectionHandleCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Average Waiting Time for Connection',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'connectionPools.' + row.key + '.waitTime';
      },
      getContent: msZeroDecimalPlaces,
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
        return 'connectionPools.' + row.key + '.connectionsCreated';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ConnectionPoolsTable({ snapshot, timeframe }) {
  const connectionPoolNames = snapshot.getIn(['data', 'connectionPoolNames'], emptyList);
  if (connectionPoolNames.size === 0) {
    return null;
  }

  const rows = connectionPoolNames.toArray().map(key => {
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
            'connectionPools.' + row.key + '.managedConnectionCount',
            'connectionPools.' + row.key + '.freeConnectionCount',
            'connectionPools.' + row.key + '.connectionHandleCount',
            'connectionPools.' + row.key + '.connectionsCreated'
          ],
          labels: [
            'ManagedConnection Objects in Use',
            'Free Connections in Pool',
            'Connection Objects in Use',
            'Connections Created'
          ],
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
          formatter: msZeroDecimalPlaces,
          metrics: ['connectionPools.' + row.key + '.waitTime'],
          labels: ['Average Waiting Time for Connection'],
          type: 'line'
        }}
      />
    </div>
  );
}
