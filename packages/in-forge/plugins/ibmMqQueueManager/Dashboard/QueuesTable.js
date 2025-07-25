/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getIbmMqQueuesForQueueManager from 'in-forge/plugins/ibmMqQueueManager/subscriptions/getIbmMqQueuesForQueueManager';
import { number, percentage } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.usage'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueUsage']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.queueFullPercentage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'queueFullPercentage';
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.queueDepth'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'queueDepth';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.maxQueueDepth'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'maxQueueDepth';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.openInputCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'openInputCount';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.openOutputCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'openOutputCount';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.lastPutDateTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'lastPutDateTime'], 'N/A');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.lastGetDateTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'lastGetDateTime'], 'N/A');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.queueType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueType']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.baseQueueName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'baseQueueName']);
      }
    }
  }
];

export default connectTo(
  props => ({
    queues: timeConfig$
      .flatMap(timeConfig => getIbmMqQueuesForQueueManager({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function QueuesTable({ queues, timeConfig }) {
    if (queues == null || queues.length === 0) {
      return null;
    }

    const rows = queues.map(queue => {
      const id = queue.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: queue,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmMqQueueManager.dashboard.queuesWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
