/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Map } from 'immutable';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import getFileMonitoringConditionForSystem from 'in-forge/plugins/fileMonitoring/subscriptions/getFileMonitoringConditionForSystem';
// @ts-expect-error needs TS migration
import { getSnapshots } from 'in-stores/snapshot';
import { seconds } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { t } from 'in-i18n';

interface SituationsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

interface SituationsRow {
  key: string;
  snapshotId: string;
  timeConfig: TimeConfig;
  monitorData: Map<string, string | number>;
}

const cols = [
  {
    title: t('in-forge:plugins.fileMonitoring.dashboard.monitor'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: SituationsRow) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.fileMonitoring.dashboard.path'),
    type: 'string',
    typeArgs: {
      getValue(row: SituationsRow) {
        return row.monitorData.get('path');
      }
    }
  },
  {
    title: t('in-forge:plugins.fileMonitoring.dashboard.pollingInterval'),
    type: 'number',
    typeArgs: {
      getContent(value: number) {
        return seconds.fixedCompact(value);
      },
      getValue(row: SituationsRow) {
        return row.monitorData.get('interval');
      }
    }
  },
  {
    title: t('in-forge:plugins.fileMonitoring.dashboard.severity'),
    type: 'string',
    typeArgs: {
      getValue(row: SituationsRow) {
        return row.monitorData.get('severity');
      }
    }
  },
  {
    title: t('in-forge:plugins.fileMonitoring.dashboard.issueTriggered'),
    type: 'string',
    typeArgs: {
      getContent(value: string) {
        return value;
      },
      getValue(row: SituationsRow) {
        return row.monitorData.get('issueTriggered') === 1 ? 'Yes' : 'No';
      }
    }
  }
];

const Monitors = ({ snapshotId, timeConfig }: SituationsProps) => {
  const snapShotDetails: any = useObservable(
    () =>
      timeConfig$
        .flatMap(timeConfig => getFileMonitoringConditionForSystem({ snapshotId, timeConfig }))
        .flatMap(getSnapshots),
    [snapshotId, timeConfig]
  );
  if (!snapShotDetails) {
    return null;
  }
  const rows = snapShotDetails
    .map((entry: Map<string, Object>) => {
      return {
        id: entry.get('id'),
        data: entry.get('data')
      };
    })
    .map((monitor: any) => {
      return {
        key: monitor.id,
        snapshotId: snapshotId,
        monitorData: monitor.data,
        timeConfig
      };
    });

  return <Table withoutPadding cardTitle={t('in-forge:plugins.fileMonitoring.monitors')} cols={cols} rows={rows} />;
};

export default Monitors;
