/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getIbmMqQueueManagersForCluster from 'in-subscription/ibmMqCluster/getIbmMqQueueManagersForCluster';
import { number } from 'in-services/formatters/number';
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
        return row.qm.getIn(['data', 'status']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.version'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.qm.getIn(['data', 'version']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.platform'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.qm.getIn(['data', 'platform']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.startedAt'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.qm.getIn(['data', 'startDate']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.alternatedAt'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.qm.getIn(['data', 'alternatedDate']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.maxHandles'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.qm.getIn(['data', 'maxHandles']);
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.ibmMqCluster.dashboard.connections'),
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

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmMqCluster.dashboard.queueManagersWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
