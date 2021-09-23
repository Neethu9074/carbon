/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getAliCloudRocketMqGroups from 'in-forge/plugins/aliCloudRocketMqGroup/subscriptions//getAliCloudRocketMqGroups';
import { formatDateTime } from 'in-services/formatters/date';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const missingValue = '/';

const cols = [
  {
    title: t('in-forge:plugins.aliCloudRocketMq.groupId'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.aliCloudRocketMq.groupType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'GroupType'], missingValue);
      }
    }
  },
  {
    title: t('in-forge:plugins.aliCloudRocketMq.groupRemark'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'Remark'], missingValue);
      }
    }
  },
  {
    title: t('in-forge:plugins.aliCloudRocketMq.groupCreateTime'),
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
    groups: timeConfig$
      .flatMap(timeConfig => getAliCloudRocketMqGroups({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function GroupsTable({ groups, timeConfig }) {
    if (groups == null || groups.length === 0) {
      return null;
    }

    const rows = groups.map(group => {
      const id = group.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: group,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.aliCloudRocketMq.groupsNumber', { count: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
