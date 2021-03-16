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
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.queueManager'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topic.getIn(['data', 'qmName']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topic.getIn(['data', 'topicType']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.alternatedAt'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topic.getIn(['data', 'topicAlternatedAt'], 'N/A');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.messages'),
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
    title: t('in-forge:plugins.ibmMqCluster.dashboard.publishers'),
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
    title: t('in-forge:plugins.ibmMqCluster.dashboard.subscriptions'),
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

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmMqCluster.dashboard.topicsWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
