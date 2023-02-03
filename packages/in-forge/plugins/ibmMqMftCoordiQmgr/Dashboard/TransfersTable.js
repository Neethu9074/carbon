/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import getIbmMqMftTransfersForCoordiQmgr from '../subscriptions/getIbmMqMftTransfersForCoordiQmgr';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqMftTransfer.dashboard.transferID'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftTransfer.dashboard.currentFile'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'sourceFileName']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftTransfer.dashboard.sourceAgent'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'sourceAgent']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftTransfer.dashboard.destinationAgent'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'destinationAgent']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftTransfer.dashboard.progressByItem'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'progressByItem']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftTransfer.dashboard.elapsedSeconds'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'elapsedSeconds';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftTransfer.dashboard.statsTransferredBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'statsTransferredBytes';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftTransfer.dashboard.currentItemSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'currentItemSize';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftTransfer.dashboard.actionStatus'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'actionStatus']);
      }
    }
  }
];

export default connectTo(
  props => ({
    transfers: timeConfig$
      .flatMap(timeConfig => getIbmMqMftTransfersForCoordiQmgr({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function MftTransfersTable({ transfers, timeConfig }) {
    if (transfers == null || transfers.length === 0) {
      return null;
    }

    const rows = transfers.map(transfer => {
      const id = transfer.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: transfer,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.transfersWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
