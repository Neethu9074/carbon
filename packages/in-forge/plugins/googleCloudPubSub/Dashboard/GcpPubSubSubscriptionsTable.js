/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getPubSubSubscriptions from 'in-forge/plugins/googleCloudPubSub/subscriptions/getPubSubSubscriptions';
import { number, bytes, seconds } from 'in-services/formatters/number';
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
    title: t('in-forge:plugins.googleCloudPubSub.dashboard.topic'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topicName;
      }
    }
  },
  {
    title: t('in-forge:plugins.googleCloudPubSub.dashboard.ackMessages'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'ack_message_count';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.googleCloudPubSub.dashboard.unackMessages'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'num_undelivered_messages';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.googleCloudPubSub.dashboard.backlogMessagesSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'backlog_bytes';
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
    subscriptions: timeConfig$
      .flatMap(timeConfig => getPubSubSubscriptions({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function GcpPubSubSubscriptionsTable({ subscriptions, timeConfig }) {
    if (subscriptions == null || subscriptions.length === 0) {
      return null;
    }

    const rows = subscriptions.map(subscription => {
      return {
        key: subscription.get('id'),
        subscriptionName: subscription.getIn(['data', 'subscriptionName']),
        topicName: subscription.getIn(['data', 'topicName']),
        subscription,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.googleCloudPubSub.dashboard.subscriptionsWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
