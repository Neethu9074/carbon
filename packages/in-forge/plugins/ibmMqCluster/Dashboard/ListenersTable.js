/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getIbmMqListenersForCluster from 'in-subscription/ibmMqCluster/getIbmMqListenersForCluster';
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
        return row.listener.getIn(['data', 'listenerStatus']);
      }
    }
  },
  {
    title: 'Port',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.listener.getIn(['data', 'listenerPort']);
      }
    }
  },
  {
    title: 'IP Address',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.listener.getIn(['data', 'listenerIpAddress']);
      }
    }
  },
  {
    title: 'Started At',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.listener.getIn(['data', 'listenerStartedAt']);
      }
    }
  },
  {
    title: 'QM Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.listener.getIn(['data', 'qmName']);
      }
    }
  }
];

export default connectTo(
  props => ({
    listeners: timeConfig$
      .flatMap(timeConfig => getIbmMqListenersForCluster({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function ListenersTable({ listeners, timeConfig }) {
    if (listeners == null || listeners.length === 0) {
      return null;
    }

    const rows = listeners.map(listener => {
      return {
        key: listener.get('id'),
        listener,
        timeConfig
      };
    });

    return <Table withoutPadding cardTitle={`Listeners (${rows.length})`} cols={cols} rows={rows} />;
  }
);
