/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getIbmMqChannelsForQueueManager from 'in-subscription/ibmMqQueueManager/getIbmMqChannelsForQueueManager';
import { number } from 'in-services/formatters/number';
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
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'channelStatus']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.inDoubt'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'channelInDoubt']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.substate'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'channelSubStatus']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.connectionName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'connectionName']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.activeConversations'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'activeConversations';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.remoteQueueManager'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'remoteQM'], missingValue);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.startDateTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'startDateTime']);
      }
    }
  }
];

export default connectTo(
  props => ({
    channels: timeConfig$
      .flatMap(timeConfig => getIbmMqChannelsForQueueManager({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function QueuesUsageTable({ channels, timeConfig }) {
    if (channels == null || channels.length === 0) {
      return null;
    }

    const rows = channels.map(channel => {
      const id = channel.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: channel,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmMqQueueManager.dashboard.channelsWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
