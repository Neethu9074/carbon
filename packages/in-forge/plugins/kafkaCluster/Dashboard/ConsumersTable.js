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
        return `kafkaClient.consumer.${row.consumerId}.consumedByteRate`;
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
        return `kafkaClient.consumer.${row.consumerId}.consumerFetchThrottleTime`;
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
        return `kafkaClient.consumer.${row.consumerId}.consumerFetchLatency`;
      },
      getContent: ms.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ConsumersTable({ clientSnapshots, timeConfig }) {
  if (!clientSnapshots) {
    return null;
  }

  let rows = [];

  clientSnapshots.forEach(jvmSnapshot => {
    const ids = jvmSnapshot.getIn(['data', 'kafkaClient.consumer.clientIds']);
    ids.forEach(consumerId => {
      rows.push({
        key: String(consumerId) + jvmSnapshot.get('id'),
        consumerId: String(consumerId),
        name: String(consumerId.split('#')[1]),
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
      cardTitle={`Consumers (` + rows.length + `)`}
      cols={cols}
      rows={rows}
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
        metrics: [`kafkaClient.consumer.${row.consumerId}.consumedByteRate`],
        labels: ['Byte Rate'],
        type: 'line'
      }}
      y2={{
        formatter: ms.compact,
        tooltipFormatter: ms.compact,
        metrics: [
          `kafkaClient.consumer.${row.consumerId}.consumerFetchThrottleTime`,
          `kafkaClient.consumer.${row.consumerId}.consumerFetchLatency`
        ],
        labels: ['Throttling', 'Latency'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
