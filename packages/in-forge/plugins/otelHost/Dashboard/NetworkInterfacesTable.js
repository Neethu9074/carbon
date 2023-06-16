/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'NetWork',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Packets Receive',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `network.${row.name}.packets_receive`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Packets Rransmit',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `network.${row.name}.packets_transmit`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'I/O Receive',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `network.${row.name}.io_receive`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'I/O Transmit',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `network.${row.name}.io_transmit`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Dropped Receive',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `network.${row.name}.dropped_receive`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Dropped Transmit',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `network.${row.name}.dropped_transmit`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Errors Receive',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `network.${row.name}.errors_receive`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Errors Transmit',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `network.${row.name}.errors_transmit`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function NetworkInterfacesTable({ snapshot, timeConfig }) {
  const rows = snapshot
    .getIn(['data', 'network'], emptyMap)
    .map((iface, name) => {
      return {
        key: name,
        name: name,
        iface,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    })
    .valueSeq()
    .toArray();

  return <Table cardTitle={'NetWork'} withoutPadding cols={cols} rows={rows} getRowDetails={getDetails} />;
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: bytesTwoDecimalPlaces,
        metrics: ['network.' + row.key + '.dropped_receive', 'network.' + row.key + '.packets_transmit'],
        labels: ['Dropped Receive', 'Dropped Transmit'],
        type: 'line'
      }}
      y2={{
        min: 0,
        max: 1,
        metrics: ['network.' + row.key + '.io_receive', 'network.' + row.key + '.io_transmit'],
        labels: ['I/O Receive', 'I/O Transmit'],
        formatter: bytesTwoDecimalPlaces,
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
