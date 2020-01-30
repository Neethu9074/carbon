import React, { Fragment } from 'react';

import { bytesPerSecondTwoDecimalPlaces, ms } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Producer',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.clientName;
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
        return `kafkaClient.producer.${row.key}.producerOutgoingByteRate`;
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
        return `kafkaClient.producer.${row.key}.produceThrottleTime`;
      },
      getContent: ms.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ClusterProducerClientQuotasTable({ snapshot, timeConfig }) {
  const clientIds = snapshot
    .getIn(['data', 'kafkaClient.producer.clientIds'], emptyList)
    .toArray()
    .sort();
  if (clientIds.length === 0) {
    return null;
  }

  const rows = clientIds.map(clientId => {
    let clientName = clientId.split('#')[1];
    return {
      key: clientId,
      clientName: clientName,
      timeConfig,
      snapshotId: snapshot.get('id')
    };
  });

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
    <Fragment>
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: bytesPerSecondTwoDecimalPlaces,
            tooltipFormatter: bytesPerSecondTwoDecimalPlaces,
            metrics: [`kafkaClient.producer.${row.key}.producerOutgoingByteRate`],
            labels: ['Byte Rate'],
            type: 'line'
          }}
          y2={{
            formatter: ms.compact,
            tooltipFormatter: ms.compact,
            metrics: [`kafkaClient.producer.${row.key}.produceThrottleTime`],
            labels: ['Throttling'],
            type: 'line'
          }}
        />
      </Columize>
    </Fragment>
  );
}
