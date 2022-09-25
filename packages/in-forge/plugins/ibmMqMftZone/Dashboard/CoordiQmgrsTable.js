/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import getIbmMqMftCoordinationQueueManagersForZone from '../subscriptions/getIbmMqMftCoordinationQueueManagersForZone';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.coordiQmgrName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.coordiQmgrHost'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.coordiQmgr.getIn(['data', 'coordiQmgrHost']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.connectionChannel'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.coordiQmgr.getIn(['data', 'connectionChannel']);
      }
    }
  }
];

export default connectTo(
  props => ({
    coordiQmgrs: timeConfig$
      .flatMap(timeConfig =>
        getIbmMqMftCoordinationQueueManagersForZone({ snapshotId: props.snapshot.snapshot.get('id'), timeConfig })
      )
      .flatMap(getSnapshots)
  }),
  function CoordiQmgrsTable({ coordiQmgrs, timeConfig }) {
    if (coordiQmgrs == null || coordiQmgrs.length === 0) {
      return null;
    }

    const rows = coordiQmgrs.map(coordiQmgr => {
      return {
        key: coordiQmgr.get('id'),
        coordiQmgr,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmMqMftZone.dashboard.instancesWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
