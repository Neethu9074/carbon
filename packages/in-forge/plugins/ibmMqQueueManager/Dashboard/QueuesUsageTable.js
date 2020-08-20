import React from 'react';

import getIBMMQQueuesUsageForQueueManager from 'in-subscription/ibmMqQueueManager/getIBMMQQueuesUsageForQueueManager';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

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
        return row.snapshot.getIn(['data', 'application']);
      }
    }
  },
  {
    title: 'Channel',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'channel']);
      }
    }
  },
  {
    title: 'Connection',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'connection']);
      }
    }
  },
  {
    title: 'Handle State',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'handleState']);
      }
    }
  },
  {
    title: 'User',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'user']);
      }
    }
  }
];

export default connectTo(
  props => ({
    queuesUsage: timeConfig$
      .flatMap(timeConfig => getIBMMQQueuesUsageForQueueManager({ snapshotId: props.snapshot.get('id'), timeConfig }))
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
