import React from 'react';

import getPubSubTopics from 'in-subscription/googleCloudPubSub/getPubSubTopics';
import { bytes, seconds } from 'in-services/formatters/number';
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
    title: 'Messages size',
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
    title: 'Operations Cost',
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
    title: 'Oldest Ack Message',
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
    title: 'Oldest Unack Message',
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

    return <Table withoutPadding cardTitle={`Topics (${rows.length})`} cols={cols} rows={rows} />;
  }
);
