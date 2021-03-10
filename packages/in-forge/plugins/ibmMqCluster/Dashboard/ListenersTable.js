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
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.listener.getIn(['data', 'listenerStatus']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.port'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.listener.getIn(['data', 'listenerPort']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.ipAddress'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.listener.getIn(['data', 'listenerIpAddress']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.startedAt'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.listener.getIn(['data', 'listenerStartedAt']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.qmName'),
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

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmMqCluster.dashboard.listenersWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
