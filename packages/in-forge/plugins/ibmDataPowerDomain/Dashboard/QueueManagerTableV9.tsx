/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import getIbmDataPowerQueueManagerV9ForDomain from 'in-forge/plugins/ibmDataPowerDomain/subscriptions/getIbmDataPowerQueueManagerV9ForDomain';
// @ts-expect-error needs TS migration
import { getSnapshots } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { SnapshotData } from 'in-stores/snapshot';
import { t } from 'in-i18n';

interface QueueManagerV9Props {
  snapshotId: SnapshotData;
  timeConfig: TimeConfig;
}

interface QueueManagerV9Row {
  key: string;
  snapshotId: string;
  timeConfig: TimeConfig;
  queueManagerTable: Map<string, string | number>;
}

const cols = [
  {
    title: t('in-forge:plugins.ibmDataPowerDomain.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: QueueManagerV9Row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerDomain.domainName'),
    type: 'string',
    typeArgs: {
      getValue(row: QueueManagerV9Row) {
        return row.queueManagerTable.get('domainName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerDomain.remoteHost'),
    type: 'string',
    typeArgs: {
      getValue(row: QueueManagerV9Row) {
        return row.queueManagerTable.get('remoteHost');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerDomain.state'),
    type: 'string',
    typeArgs: {
      getValue(row: QueueManagerV9Row) {
        return row.queueManagerTable.get('state');
      }
    }
  }
];

const QueueManagerV9Table = ({ snapshotId, timeConfig }: QueueManagerV9Props) => {
  const queueManagerV9Interface: any = useObservable(
    () =>
      timeConfig$
        .flatMap(timeConfig => getIbmDataPowerQueueManagerV9ForDomain({ snapshotId, timeConfig }))
        .flatMap(getSnapshots),
    [snapshotId, timeConfig]
  );
  if (queueManagerV9Interface == null || queueManagerV9Interface.length === 0) {
    return null;
  }
  const rows = queueManagerV9Interface.map((queueManagerInterface: any) => {
    return {
      key: queueManagerInterface.get('id'),
      snapshotId: queueManagerInterface.get('id'),
      queueManagerTable: queueManagerInterface.get('data'),
      timeConfig
    };
  });
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmDataPowerDomain.queueManagersV9Number', { count: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
};

export default QueueManagerV9Table;
