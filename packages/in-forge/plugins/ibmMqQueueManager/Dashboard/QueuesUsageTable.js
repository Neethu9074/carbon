/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getIbmMqQueuesUsageForQueueManager from 'in-forge/plugins/ibmMqQueueManager/subscriptions/getIbmMqQueuesUsageForQueueManager';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const missingValue = '/';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.application'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'application'], missingValue);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.channel'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'channel'], missingValue);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.connection'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'connection'], missingValue);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.handleState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'handleState'], missingValue);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.user'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'user'], missingValue);
      }
    }
  }
];

export default connectTo(
  props => ({
    queuesUsage: timeConfig$
      .flatMap(timeConfig => getIbmMqQueuesUsageForQueueManager({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function QueuesUsageTable({ queuesUsage, timeConfig }) {
    if (queuesUsage == null || queuesUsage.length === 0) {
      return null;
    }

    const rows = queuesUsage.map(queueUsage => {
      const id = queueUsage.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: queueUsage,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmMqQueueManager.dashboard.queuesUsageWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
