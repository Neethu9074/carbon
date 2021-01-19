/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getIbmMqTopicsForCluster from 'in-subscription/ibmMqCluster/getIbmMqTopicsForCluster';
import { number } from 'in-services/formatters/number';
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
    title: 'Queue Manager',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topic.getIn(['data', 'qmName']);
      }
    }
  },
  {
    title: 'Type',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topic.getIn(['data', 'topicType']);
      }
    }
  },
  {
    title: 'Alternated At',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topic.getIn(['data', 'topicAlternatedAt'], 'N/A');
      }
    }
  },
  {
    title: 'Messages',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'messagesCount';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Publishers',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'publishCount';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Subscriptions',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'subscriptionCount';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => ({
    topics: timeConfig$
      .flatMap(timeConfig => getIbmMqTopicsForCluster({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function TopicsTable({ topics, timeConfig }) {
    if (topics == null || topics.length === 0) {
      return null;
    }

    const rows = topics.map(topic => {
      return {
        key: topic.get('id'),
        topic,
        timeConfig
      };
    });

    return <Table withoutPadding cardTitle={`Topics (${rows.length})`} cols={cols} rows={rows} />;
  }
);
