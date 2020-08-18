import React from 'react';

import getIBMMQListenersForCluster from 'in-subscription/iBMMQCluster/getIBMMQListenersForCluster';
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
        return row.listenerStatus;
      }
    }
  },
  {
    title: 'Port',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.listenerPort;
      }
    }
  },
  {
    title: 'IP Address',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.listenerIpAddress;
      }
    }
  },
  {
    title: 'Started At',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.listenerStartedAt;
      }
    }
  },
  {
    title: 'QM Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.qmName;
      }
    }
  }
];

export default connectTo(
  props => ({
    listeners: timeConfig$
      .flatMap(timeConfig => getIBMMQListenersForCluster({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function ListenersTable({ listeners, timeConfig }) {
    if (listeners == null || listeners.length === 0) {
      return null;
    }

    const rows = listeners.map(listener => {
      return {
        key: listener.get('id'),
        listenerName: listener.getIn(['data', 'listenerName']),
        listenerStatus: listener.getIn(['data', 'listenerStatus']),
        listenerPort: listener.getIn(['data', 'listenerPort']),
        listenerIpAddress: listener.getIn(['data', 'listenerIpAddress']),
        listenerStartedAt: listener.getIn(['data', 'listenerStartedAt']),
        qmName: listener.getIn(['data', 'qmName']),
        listener,
        timeConfig
      };
    });

    return <Table withoutPadding cardTitle={`Listeners (${rows.length})`} cols={cols} rows={rows} />;
  }
);
