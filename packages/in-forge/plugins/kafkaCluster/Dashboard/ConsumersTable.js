import React from 'react';

import { bytesPerSecondTwoDecimalPlaces, ms } from 'in-services/formatters/number';
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
    title: 'Consumer',
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
        return `kafkaClient.consumer.${row.name}.consumedByteRate`;
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
        return `kafkaClient.consumer.${row.name}.consumerFetchThrottleTime`;
      },
      getContent: ms.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ConsumersTable({ jvmSnapshots }) {
  let rows = [];

  if (jvmSnapshots) {
    rows = jvmSnapshots.map(jvmSnapshot => {
      jvmSnapshot.getIn(['data', 'kafkaClient.consumer.clientIds']).map(consumer => ({
        key: 'consumer',
        snapshotId: jvmSnapshot.get('id'),
        name: consumer
      }));
    });
  }

  // if(rows.length === 0) {
  //   return null;
  // }

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
        metrics: [`kafkaClient.consumer.${row.name}.consumedByteRate`],
        labels: ['Byte Rate'],
        type: 'line'
      }}
      y2={{
        formatter: ms.compact,
        tooltipFormatter: ms.compact,
        metrics: [`kafkaClient.consumer.${row.name}.consumerFetchThrottleTime`],
        labels: ['Throttling'],
        type: 'line'
      }}
    />
  );
}
