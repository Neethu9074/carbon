import React from 'react';

import createProducersForClusterSubscription from 'in-subscription/kafkaCluster/getProducersForCluster';
import { bytesPerSecondTwoDecimalPlaces, ms } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

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

export default connectTo(
  props => ({
    snapshots: timeConfig$
      .flatMap(timeConfig =>
        createProducersForClusterSubscription({ snapshotId: props.snapshot.get('id'), timeConfig })
      )
      .flatMap(getSnapshots)
  }),

  function ProducersTable({ snapshots }) {
    let rows = [];

    if (snapshots) {
      rows = snapshots.map(snapshot => ({
        key: snapshot.get('id'),
        snapshotId: snapshot.get('id'),
        name: snapshot.getIn(['data', 'name'])
      }));
    }

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
);

function getDetails(row) {
  return (
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
  );
}
