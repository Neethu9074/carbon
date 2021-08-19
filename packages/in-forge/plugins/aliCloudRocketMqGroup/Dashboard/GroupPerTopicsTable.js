/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getAliCloudRocketMqGroupPerTopics from 'in-subscription/aliCloudRocketMq/getAliCloudRocketMqGroupPerTopics';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.aliCloudRocketMqGroup.groupPerTopic'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  }
];

export default connectTo(
  props => ({
    groupPerTopics: timeConfig$
      .flatMap(timeConfig => getAliCloudRocketMqGroupPerTopics({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function GroupPerTopicsTable({ groupPerTopics, timeConfig }) {
    if (groupPerTopics == null || groupPerTopics.length === 0) {
      return null;
    }

    const rows = groupPerTopics.map(groupPerTopic => {
      const id = groupPerTopic.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: groupPerTopic,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.aliCloudRocketMqGroup.groupPerTopicsNumber', { count: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
