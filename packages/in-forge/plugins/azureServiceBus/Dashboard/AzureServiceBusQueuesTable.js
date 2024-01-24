/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import getServiceBusQueues from 'in-forge/plugins/azureServiceBus/dimensions/getServiceBusQueues';
import { number, bytes, megaBytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.azureServiceBusQueues.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusQueues.size'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'size';
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusQueues.maxSize'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.maxSize;
      },
      getContent: megaBytes.compact
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusQueues.messages'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'messages';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusQueues.activeMessages'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'activeMessages';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusQueues.deadletteredMessages'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'deadletteredMessages';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusQueues.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.status;
      }
    }
  }
];

export default connectTo(
  props => ({
    queues: timeConfig$
      .flatMap(timeConfig => getServiceBusQueues({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
      .throttle(1000)
  }),

  function AzureServiceBusQueuesTable({ queues, timeConfig }) {
    if (queues == null || queues.length === 0) {
      return null;
    }

    const rows = queues.map(queue => {
      return {
        key: queue.get('id'),
        queueName: queue.getIn(['data', 'name']),
        status: queue.getIn(['data', 'status']),
        maxSize: queue.getIn(['data', 'maxSizeInMegabytes']),
        queue,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.azureServiceBusQueues.queuesWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
