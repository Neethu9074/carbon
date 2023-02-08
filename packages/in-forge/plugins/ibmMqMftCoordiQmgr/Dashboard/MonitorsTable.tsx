/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import getIbmMqMftMonitorsForCoordiQmgr from '../subscriptions/getIbmMqMftMonitorsForCoordiQmgr';
import { getSnapshot, SnapshotData } from 'in-stores/snapshot/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqMftMonitor.dashboard.monitor'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftMonitor.dashboard.agent'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'agent']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftMonitor.dashboard.resource'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'resource']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftMonitor.dashboard.triggerEvent'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'triggerEvent']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftMonitor.dashboard.filePattern'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'filePattern']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftMonitor.dashboard.batch'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'batch']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftMonitor.dashboard.pollInterval'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'pollInterval']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftMonitor.dashboard.status'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'status']);
      }
    }
  }
];

export default function GetMonitors({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;
  const monitors = useObservable(
    getIbmMqMftMonitorsForCoordiQmgr({ snapshotId, timeConfig: timeConfig }).flatMap(result =>
      result.data
        ? combineLatest(result.data.map(monitor => getSnapshot(monitor, timeConfig))).map(monitors => success(monitors))
        : just(pendingResult as Result<SnapshotData[]>)
    ),
    [snapshotId, timeConfig]
  );

  if (!monitors?.data) {
    return null;
  }

  const rows =
    monitors.data.map(monitor => ({
      key: monitor.get('id'),
      snapshot: monitor,
      timeConfig
    })) || [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.monitorsWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
