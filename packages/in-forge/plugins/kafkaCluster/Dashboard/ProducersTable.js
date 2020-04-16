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
    title: 'Producer',
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
        return `kafkaClient.producer.${row.name}.producerOutgoingByteRate`;
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
        return `kafkaClient.producer.${row.name}.produceThrottleTime`;
      },
      getContent: ms.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ProducersTable({ clientSnapshots }) {
  let rows = [];

  if (clientSnapshots) {
    rows = clientSnapshots.map(jvmSnapshot => {
      jvmSnapshot.getIn(['data', 'kafkaClient.producer.clientIds']).map(producer => ({
        key: 'producer',
        snapshotId: jvmSnapshot.get('id'),
        name: producer
      }));
    });
  }

  // if(rows.length === 0) {
  //   return null;
  // }

  return (
    <Table
      withoutPadding
      cardTitle={`Producers (` + rows.length + `)`}
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
        metrics: [`kafkaClient.producer.${row.name}.producerOutgoingByteRate`],
        labels: ['Byte Rate'],
        type: 'line'
      }}
      y2={{
        formatter: ms.compact,
        tooltipFormatter: ms.compact,
        metrics: [`kafkaClient.producer.${row.name}.produceThrottleTime`],
        labels: ['Throttling'],
        type: 'line'
      }}
    />
  );
}
