import React from 'react';

import createConsumersForClusterSubscription from 'in-subscription/kafkaCluster/getConsumersForCluster';
import { bytesPerSecondTwoDecimalPlaces, ms } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
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
        return `kafkaClient.consumer.${row.key}.consumerFetchThrottleTime`;
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
        createConsumersForClusterSubscription({ snapshotId: props.snapshot.get('id'), timeConfig })
      )
      .flatMap(getSnapshots)
  }),

  function ConsumersTable({ snapshots }) {
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
        cardTitle={`Consumers (` + rows.length + `)`}
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
  );
}
