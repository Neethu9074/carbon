/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import { WINDOW_FOR_LATEST_METRIC } from 'in-forge/plugins/oTelDatabase/constants';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { seconds } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const lockIdCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.lockId'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.name;
    }
  }
};

const blockingSessIdCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.blockingSessId'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.lockTime.get('blocking_sess_id');
    }
  }
};

const blockerSessIdCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.blockerSessId'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.lockTime.get('blocker_sess_id');
    }
  }
};

const blockedObjNameCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.blockedObjName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.lockTime.get('locked_obj_name');
    }
  }
};

const lockTimeCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.lockTime'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'db.lock.time.' + row.key + '.value';
    },
    getContent: seconds.detailed,
    getTimeWindowAggregation() {
      return 'mean';
    },
    getWindowForLatest() {
      return WINDOW_FOR_LATEST_METRIC;
    }
  }
};

export default function lockTimeTable({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id') as string;

  const rows = snapshot
    .getIn(['data', 'db.lock.time'], emptyMap)
    .map((lockTime: any, name: any) => {
      return {
        key: name,
        name: name,
        lockTime,
        timeConfig,
        snapshot,
        snapshotId
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }
  const cols = [lockIdCol, blockingSessIdCol, blockerSessIdCol, blockedObjNameCol, lockTimeCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.oTelDatabase.dashboard.lockTime', { count: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
