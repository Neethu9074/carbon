/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import getServiceBusTopics from 'in-forge/plugins/azureServiceBus/dimensions/getServiceBusTopics';
import { number, bytes } from 'in-services/formatters/number';
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
    title: t('in-forge:plugins.azureServiceBusTopics.maxSize'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.maxSize + ' MB';
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
    title: t('in-forge:plugins.azureServiceBusTopics.deadletteredMessages'),
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
        status: topic.getIn(['data', 'status']),
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
