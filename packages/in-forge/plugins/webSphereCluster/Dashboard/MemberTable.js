/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getWebSphereMembersForCluster from 'in-forge/plugins/webSphereCluster/subscriptions/getWebSphereMembersForCluster';
import getWebSphereSnapshotId from 'in-subscription/getWebSphereSnapshotId';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.webSphereCluster.dashboard.memberName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId$(row) {
        return getWebSphereSnapshotId({
          pid: row.member.getIn(['data', 'pid']),
          hostSnapshot: row.member
        });
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereCluster.dashboard.nodeName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.member.getIn(['data', 'nodeName']);
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereCluster.dashboard.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.member.getIn(['data', 'status']);
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereCluster.dashboard.weight'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'weight';
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
    members: timeConfig$
      .flatMap(timeConfig => getWebSphereMembersForCluster({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function MemberTable({ members, timeConfig }) {
    if (members == null || members.length === 0) {
      return null;
    }

    const rows = members.map(member => {
      return {
        key: member.get('id'),
        member,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.webSphereCluster.membersWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
