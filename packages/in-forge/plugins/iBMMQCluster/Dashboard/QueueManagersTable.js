import React from 'react';

import getIBMMQQueueManagersForCluster from 'in-subscription/iBMMQCluster/getIBMMQQueueManagersForCluster';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
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
    title: 'Status',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.status;
      }
    }
  },
  {
    title: 'Version',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.version;
      }
    }
  },
  {
    title: 'Platform',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.platform;
      }
    }
  },
  {
    title: 'Started At',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.startDate;
      }
    }
  },
  {
    title: 'Alternated At',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.alternatedDate;
      }
    }
  },
  {
    title: 'Max Handles',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.maxHandles;
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: 'Connections',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'connectionCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => ({
    queueManagers: timeConfig$
      .flatMap(timeConfig => getIBMMQQueueManagersForCluster({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function QueueManagersTable({ queueManagers, timeConfig }) {
    if (queueManagers == null || queueManagers.length === 0) {
      return null;
    }

    const rows = queueManagers.map(queueManager => {
      return {
        key: queueManager.get('id'),
        qmName: queueManager.getIn(['data', 'qmName']),
        status: queueManager.getIn(['data', 'status']),
        version: queueManager.getIn(['data', 'version']),
        platform: queueManager.getIn(['data', 'platform']),
        startDate: queueManager.getIn(['data', 'startDate']),
        alternatedDate: queueManager.getIn(['data', 'alternatedDate']),
        maxHandles: queueManager.getIn(['data', 'maxHandles']),
        queueManager,
        timeConfig
      };
    });

    return <Table withoutPadding cardTitle={`Queue Managers (${rows.length})`} cols={cols} rows={rows} />;
  }
);
