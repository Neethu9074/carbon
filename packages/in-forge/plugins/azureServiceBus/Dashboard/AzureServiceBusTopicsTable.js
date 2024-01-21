/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getServiceBusTopics from 'in-forge/plugins/azureServiceBus/dimensions/getServiceBusTopics';
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
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.size;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusQueues.maxSize'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.maxSize;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusQueues.activeMessages'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.activeMessages;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureServiceBusQueues.deadletteredMessages'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.deadLetteredMessages;
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
    topics: timeConfig$
      .flatMap(timeConfig => getServiceBusTopics({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
      .throttle(1000)
  }),

  function AzureServiceBusTopicsTable({ topics, timeConfig }) {
    if (topics == null || topics.length === 0) {
      return null;
    }

    const rows = topics.map(topic => {
      return {
        key: topic.get('id'),
        topicName: topic.getIn(['data', 'name']),

        maxSize: topic.getIn(['data', 'maxSizeInMegabytes']),
        size: topic.getIn(['data', 'sizeInBytes']),
        status: topic.getIn(['data', 'status']),
        activeMessages: topic.getIn(['data', 'activeMessageCount']),
        deadLetteredMessages: topic.getIn(['data', 'deadLetterMessageCount']),
        messages: topic.getIn(['data', 'messageCount']),
        topic,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.azureServiceBusTopics.topicsWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
