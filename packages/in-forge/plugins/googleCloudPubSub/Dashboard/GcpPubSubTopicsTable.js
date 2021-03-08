/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getPubSubTopics from 'in-subscription/googleCloudPubSub/getPubSubTopics';
import { bytes, seconds } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.googleCloudPubSub.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.googleCloudPubSub.dashboard.messagesSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'message_sizes';
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.googleCloudPubSub.dashboard.operationsCost'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'byte_cost';
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.googleCloudPubSub.dashboard.oldestAckMessage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'oldest_retained_acked_message_age';
      },
      getContent: seconds.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.googleCloudPubSub.dashboard.oldestUnackMessage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'oldest_unacked_message_age';
      },
      getContent: seconds.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => ({
    topics: timeConfig$
      .flatMap(timeConfig => getPubSubTopics({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function GcpPubSubTopicsTable({ topics, timeConfig }) {
    if (topics == null || topics.length === 0) {
      return null;
    }

    const rows = topics.map(topic => {
      return {
        key: topic.get('id'),
        topicName: topic.getIn(['data', 'topicName']),
        topic,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.googleCloudPubSub.dashboard.topicsWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
