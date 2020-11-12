import React from 'react';

import getIbmMqQueueManagersForCluster from 'in-subscription/ibmMqCluster/getIbmMqQueueManagersForCluster';
import { number } from 'in-services/formatters/number';
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
        return row.qm.getIn(['data', 'status']);
      }
    }
  },
  {
    title: 'Version',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.qm.getIn(['data', 'version']);
      }
    }
  },
  {
    title: 'Platform',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.qm.getIn(['data', 'platform']);
      }
    }
  },
  {
    title: 'Started At',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.qm.getIn(['data', 'startDate']);
      }
    }
  },
  {
    title: 'Alternated At',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.qm.getIn(['data', 'alternatedDate']);
      }
    }
  },
  {
    title: 'Max Handles',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.qm.getIn(['data', 'maxHandles']);
      },
      getContent: number.compact
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
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => ({
    queueManagers: timeConfig$
      .flatMap(timeConfig => getIbmMqQueueManagersForCluster({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function QueueManagersTable({ queueManagers, timeConfig }) {
    if (queueManagers == null || queueManagers.length === 0) {
      return null;
    }

    const rows = queueManagers.map(qm => {
      return {
        key: qm.get('id'),
        qm,
        timeConfig
      };
    });

    return <Table withoutPadding cardTitle={`Queue Managers (${rows.length})`} cols={cols} rows={rows} />;
  }
);
