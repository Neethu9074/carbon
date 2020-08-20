import React from 'react';

import getIBMMQTopicsForCluster from 'in-subscription/ibmMqCluster/getIBMMQTopicsForCluster';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
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
    title: 'Cluster',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topic.getIn(['data', 'clusterName']);
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
        return row.topic.getIn(['data', 'topicAlternatedAt']);
      }
    }
  },
  {
    title: 'Messages Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'messagesCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Publish Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'publishCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Subscription Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'subscriptionCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => ({
    topics: timeConfig$
      .flatMap(timeConfig => getIBMMQTopicsForCluster({ snapshotId: props.snapshot.get('id'), timeConfig }))
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
