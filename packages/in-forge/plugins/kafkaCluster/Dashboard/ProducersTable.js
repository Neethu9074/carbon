import React from 'react';

import { bytesPerSecondTwoDecimalPlaces, ms } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'JVM',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      }
    }
  },
  {
    title: 'ID',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Byte Rate',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `kafkaClient.producer.${row.producerId}.producerOutgoingByteRate`;
      },
      getContent: bytesPerSecondTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Throttling',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `kafkaClient.producer.${row.producerId}.produceThrottleTime`;
      },
      getContent: ms.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Latency',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `kafkaClient.producer.${row.producerId}.produceRequestLatency`;
      },
      getContent: ms.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ProducersTable({ clientSnapshots, timeConfig }) {
  if (!clientSnapshots) {
    return null;
  }

  let rows = [];

  clientSnapshots.forEach(jvmSnapshot => {
    const ids = jvmSnapshot.getIn(['data', 'kafkaClient.producer.clientIds']);
    ids.forEach(producerId => {
      rows.push({
        key: String(producerId) + jvmSnapshot.get('id'),
        producerId: String(producerId),
        name: String(producerId.split('#')[1]),
        snapshotId: jvmSnapshot.get('id'),
        timeConfig
      });
    });
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={`Producers (` + rows.length + `)`}
      rows={rows}
      cols={cols}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        formatter: bytesPerSecondTwoDecimalPlaces,
        tooltipFormatter: bytesPerSecondTwoDecimalPlaces,
        metrics: [`kafkaClient.producer.${row.producerId}.producerOutgoingByteRate`],
        labels: ['Byte Rate'],
        type: 'line'
      }}
      y2={{
        formatter: ms.compact,
        tooltipFormatter: ms.compact,
        metrics: [
          `kafkaClient.producer.${row.producerId}.produceThrottleTime`,
          `kafkaClient.producer.${row.producerId}.produceRequestLatency`
        ],
        labels: ['Throttling', 'Latency'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
