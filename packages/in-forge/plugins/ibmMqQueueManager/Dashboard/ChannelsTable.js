/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getIbmMqChannelsForQueueManager from 'in-subscription/ibmMqQueueManager/getIbmMqChannelsForQueueManager';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const missingValue = '/';

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
    title: 'Status',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'channelStatus']);
      }
    }
  },
  {
    title: 'In Doubt',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'channelInDoubt']);
      }
    }
  },
  {
    title: 'Substate',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'channelSubStatus']);
      }
    }
  },
  {
    title: 'Connection Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'connectionName']);
      }
    }
  },
  {
    title: 'Remote Queue Manager',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'remoteQM'], missingValue);
      }
    }
  },
  {
    title: 'Last Message Date/Time',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'lastMessage'], missingValue);
      }
    }
  },
  {
    title: 'Start Date/Time',
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

    return <Table withoutPadding cardTitle={`Channels (${rows.length})`} cols={cols} rows={rows} />;
  }
);
