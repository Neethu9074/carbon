/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Queue',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Messages ready',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queue_map.' + row.key + '.messages_ready';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Messages unacknowledged',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queue_map.' + row.key + '.messages_unacknowledged';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Messages total',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queue_map.' + row.key + '.messages';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function QueuesTable({ snapshot, timeConfig }) {
  const queues = snapshot
    .getIn(['data', 'monitoredQueues'], emptyList)
    .toArray()
    .sort();
  if (queues.length === 0) {
    return null;
  }

  const rows = queues.map(queue => {
    return {
      key: queue,
      timeConfig,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <Table withoutPadding cardTitle={`Queues (${rows.length})`} cols={cols} rows={rows} getRowDetails={getRowDetails} />
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: ['queue_map.' + row.key + '.messages_ready', 'queue_map.' + row.key + '.messages_unacknowledged'],
          labels: ['Messages ready', 'Messages unacknowledged'],
          type: 'stackedArea',
          formatter: zeroDecimalPlaces
        }}
        y2={{
          metrics: ['queue_map.' + row.key + '.messages'],
          labels: ['Messages total'],
          type: 'line',
          formatter: zeroDecimalPlaces
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
