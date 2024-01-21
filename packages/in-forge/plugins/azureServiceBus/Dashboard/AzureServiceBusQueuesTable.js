/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getServiceBusQueues from 'in-forge/plugins/azureServiceBus/dimensions/getServiceBusQueues';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.azureServiceBusTopics.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusTopics.size'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.size;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusTopics.maxSize'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.maxSize;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusTopics.messages'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.messages;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusTopics.activeMessages'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.activeMessages;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusTopics.deadletteredMessages'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.deadLetteredMessages;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusTopics.status'),
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
        maxSize: queue.getIn(['data', 'maxSizeInMegabytes']),
        size: queue.getIn(['data', 'sizeInBytes']),
        status: queue.getIn(['data', 'status']),
        activeMessages: queue.getIn(['data', 'activeMessageCount']),
        deadLetteredMessages: queue.getIn(['data', 'deadLetterMessageCount']),
        messages: queue.getIn(['data', 'messageCount']),
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
