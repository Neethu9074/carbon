import React from 'react';

import getIBMMQQueuesUsageForQueueManager from 'in-subscription/iBMMQQueueManager/getIBMMQQueuesUsageForQueueManager';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueName']);
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
    title: 'Input Type',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'inputType']);
      }
    }
  },
  {
    title: 'Output',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'output']);
      }
    }
  },
  {
    title: 'Inquire',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'inquire']);
      }
    }
  },
  {
    title: 'Set',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'set']);
      }
    }
  },
  {
    title: 'Browse',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'browse']);
      }
    }
  },
  {
    title: 'Output Count',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'output']);
      }
    }
  },
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueName']);
      }
    }
  },
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueName']);
      }
    }
  },
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueName']);
      }
    }
  },
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueName']);
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
