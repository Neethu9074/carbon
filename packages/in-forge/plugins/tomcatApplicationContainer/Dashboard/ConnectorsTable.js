/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyMap } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

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
    title: 'Threads',
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

export default function ConnectorsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'connector-config'], emptyMap)
    .filter(c => !c.get('executor'))
    .map((connector, name) => {
      return {
        key: name,
        connector,
        snapshotId,
        timeConfig
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
    <Table
      withoutPadding
      cardTitle={`Connectors (${rows.length})`}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function createDetailsWithConnections(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        metrics: [
          'connectors.' + row.key + '.threads',
          'connectors.' + row.key + '.threadsBusy',
          'connectors.' + row.key + '.connections'
        ],
        labels: [row.key + ' Threads', row.key + ' Busy Threads', row.key + ' Connections'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function createDetailsWithoutConnections(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        metrics: ['connectors.' + row.key + '.threads', 'connectors.' + row.key + '.threadsBusy'],
        labels: [row.key + ' Threads', row.key + ' Busy Threads'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
