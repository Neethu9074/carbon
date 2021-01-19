/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { number, percentage } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { emptyMap } from 'in-services/fixedImmutables';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Queue Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'dlqueues.' + row.key + '.queueSize';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Messages Enqueued',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'dlqueues.' + row.key + '.enqueueCount';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Messages Dequeued',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'dlqueues.' + row.key + '.dequeueCount';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Memory Usage',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'dlqueues.' + row.key + '.memoryPercentage';
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DLQueuesTable({ snapshot, timeConfig }) {
  const queueNames = snapshot.getIn(['data', 'dlqueueNames'], emptyMap);
  if (queueNames.size === 0) {
    return null;
  }
  const rows = queueNames.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return <Table withoutPadding cardTitle={`Dead-Letter Queues (${rows.length})`} cols={cols} rows={rows} />;
}
