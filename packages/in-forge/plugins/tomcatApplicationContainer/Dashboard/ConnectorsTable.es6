import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { number } from 'in-services/formatters/number';

// Tomcat 6 which does not have connection infos
const colsWithoutConnections = [
  {
    title: 'Connector',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Thread Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `connectors.${row.key}.threads`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Busy Threads',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `connectors.${row.key}.threadsBusy`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Max Threads',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.connector.getIn(['threads', 'max']);
      },
      getContent: number.compact
    }
  }
];

const colsWithConnections = [
  ...colsWithoutConnections,
  {
    title: 'Connection Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `connectors.${row.key}.connections`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Max Connections',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.connector.getIn(['connections', 'max']);
      },
      getContent: number.compact
    }
  }
];

export default function ConnectorsTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'connector-config'], emptyMap)
    .filter(c => !c.get('executor'))
    .map((connector, name) => {
      return {
        key: name,
        connector,
        snapshotId,
        timeframe
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  let cols = colsWithoutConnections;
  let getRowDetails = createDetailsWithoutConnections;
  if (rows[0].connector.get('connections')) {
    cols = colsWithConnections;
    getRowDetails = createDetailsWithConnections;
  }

  return (
    <DashboardSection title={`Connectors (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function createDetailsWithConnections(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 80
      }}
      y1={{
        metrics: [
          'connectors.' + row.key + '.threads',
          'connectors.' + row.key + '.threadsBusy',
          'connectors.' + row.key + '.connections'
        ],
        labels: [row.key + ' Threads', row.key + ' Threads Busy', row.key + ' Connections'],
        type: 'line'
      }}
    />
  );
}

function createDetailsWithoutConnections(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 80
      }}
      y1={{
        metrics: ['connectors.' + row.key + '.threads', 'connectors.' + row.key + '.threadsBusy'],
        labels: [row.key + ' Threads', row.key + ' Threads Busy'],
        type: 'line'
      }}
    />
  );
}
