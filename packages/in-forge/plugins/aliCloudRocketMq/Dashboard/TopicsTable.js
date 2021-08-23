/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getAliCloudRocketMqTopics from 'in-subscription/aliCloudRocketMq/getAliCloudRocketMqTopics';
import { formatDateTime } from 'in-services/formatters/date';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const missingValue = '/';

const cols = [
  {
    title: t('in-forge:plugins.aliCloudRocketMq.topic'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.aliCloudRocketMq.messageType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return t('in-forge:plugins.aliCloudRocketMq.messageType', {
          context: String(row.snapshot.getIn(['data', 'MessageType']))
        });
      }
    }
  },
  {
    title: t('in-forge:plugins.aliCloudRocketMq.relation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return t('in-forge:plugins.aliCloudRocketMq.relation', {
          context: String(row.snapshot.getIn(['data', 'Relation']))
        });
      }
    }
  },
  {
    title: t('in-forge:plugins.aliCloudRocketMq.topicRemark'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'Remark'], missingValue);
      }
    }
  },
  {
    title: t('in-forge:plugins.aliCloudRocketMq.topicCreateTime'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'CreateTime']);
      },
      getContent: formatDateTime
    }
  }
];

export default connectTo(
  props => ({
    topics: timeConfig$
      .flatMap(timeConfig => getAliCloudRocketMqTopics({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function TopicsTable({ topics, timeConfig }) {
    if (topics == null || topics.length === 0) {
      return null;
    }

    const rows = topics.map(topic => {
      const id = topic.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: topic,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.aliCloudRocketMq.topicsNumber', { count: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
