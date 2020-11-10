import React from 'react';

import getIbmMqQueuesUsageForQueueManager from 'in-subscription/ibmMqQueueManager/getIbmMqQueuesUsageForQueueManager';
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
    title: 'Application',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'application'], missingValue);
      }
    }
  },
  {
    title: 'Channel',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'channel'], missingValue);
      }
    }
  },
  {
    title: 'Connection',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'connection'], missingValue);
      }
    }
  },
  {
    title: 'Handle State',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'handleState'], missingValue);
      }
    }
  },
  {
    title: 'User',
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

    return <Table withoutPadding cardTitle={`Queues Usage (${rows.length})`} cols={cols} rows={rows} />;
  }
);
