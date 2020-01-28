import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytesZeroDecimalPlaces, ms } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Consumer',
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
        return `kafkaClient.consumer.${row.key}.consumedByteRate`;
      },
      getContent: bytesZeroDecimalPlaces,
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
        return `kafkaClient.consumer.${row.key}.consumerFetchThrottleTime`;
      },
      getContent: ms.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ClusterConsumerClientQuotasTable({ snapshot, timeConfig }) {
  const clientIds = snapshot
    .getIn(['data', 'kafkaClient.consumer.clientIds'], emptyList)
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
      cardTitle={`Consumers (` + rows.length + `)`}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <DashboardSection>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytesZeroDecimalPlaces,
          tooltipFormatter: bytesZeroDecimalPlaces,
          metrics: [`kafkaClient.consumer.${row.key}.consumedByteRate`],
          labels: ['Byte Rate'],
          type: 'line'
        }}
        y2={{
          formatter: ms.compact,
          tooltipFormatter: ms.compact,
          metrics: [`kafkaClient.consumer.${row.key}.consumerFetchThrottleTime`],
          labels: ['Throttling'],
          type: 'line'
        }}
      />
    </DashboardSection>
  );
}
