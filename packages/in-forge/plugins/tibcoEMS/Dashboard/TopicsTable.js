/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getTibcoEMSTopics from 'in-forge/plugins/tibcoEMS/subscriptions/getTibcoEMSTopics';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.tibcoEMS.titleName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.titleSubscribers'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'subscriberCount';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.titleInMessages'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'inMessagesCount';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.titleOutMessages'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'outMessagesCount';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.labelInMessagesRate'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'inMessages';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.labelOutMessagesRate'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'outMessages';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => ({
    topics: timeConfig$
      .flatMap(timeConfig => getTibcoEMSTopics({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function TopicsTable({ topics, timeConfig }) {
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
        cardTitle={t('in-forge:plugins.tibcoEMS.titleTopicsCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
