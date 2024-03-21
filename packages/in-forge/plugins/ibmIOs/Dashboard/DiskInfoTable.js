/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import getDiskInfo from 'in-forge/plugins/ibmIOs/subscriptions/getDiskInfo';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmIOs.diskInfo'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  }
];
export default connectTo(
  props => ({
    diskInfo: timeConfig$
      .flatMap(timeConfig => getDiskInfo({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function DiskInfoTable({ diskInfo, timeConfig }) {
    if (diskInfo == null || diskInfo.length === 0) {
      return null;
    }
    const rows = diskInfo.map(info => {
      return {
        key: info.get('id'),
        snapshotId: info.get('id'),
        info,
        timeConfig
      };
    });
    return <Table withoutPadding cardTitle={t('in-forge:plugins.ibmIOs.diskInfo')} cols={cols} rows={rows} />;
  }
);
