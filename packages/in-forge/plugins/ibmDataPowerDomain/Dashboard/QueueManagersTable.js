/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import getIbmDataPowerQueueManagersForDomain from 'in-subscription/ibmDataPowerDomain/getIbmDataPowerQueueManagersForDomain';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: t('in-forge:plugins.ibmDataPowerDomain.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerDomain.domainName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.qm.getIn(['data', 'domainName']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerDomain.remoteHost'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.qm.getIn(['data', 'remoteHost']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerDomain.state'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.qm.getIn(['data', 'state']);
      }
    }
  }
];

export default connectTo(
  props => ({
    queueManagers: timeConfig$
      .flatMap(timeConfig =>
        getIbmDataPowerQueueManagersForDomain({ snapshotId: props.snapshot.get('id'), timeConfig })
      )
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
        cardTitle={t('in-forge:plugins.ibmDataPowerDomain.queueManagersNumber', { number: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
