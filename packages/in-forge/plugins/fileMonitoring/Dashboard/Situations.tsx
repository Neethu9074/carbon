/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface SituationsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

interface SituationsRow {
  key: string;
  snapshotId: string;
  timeConfig: string;
  monitor: any;
}

const cols = [
  {
    title: t('in-forge:plugins.fileMonitoring.dashboard.name'),
    type: 'string',
    typeArgs: {
      getValue(row: SituationsRow) {
        return row.monitor.get('name');
      }
    }
  },
  {
    title: t('in-forge:plugins.fileMonitoring.dashboard.path'),
    type: 'string',
    typeArgs: {
      getValue(row: SituationsRow) {
        return row.monitor.get('path');
      }
    }
  },
  {
    title: t('in-forge:plugins.fileMonitoring.dashboard.pollingInterval'),
    type: 'number',
    typeArgs: {
      getContent(value: number) {
        return value;
      },
      getValue(row: SituationsRow) {
        return row.monitor.get('interval');
      }
    }
  },
  {
    title: t('in-forge:plugins.fileMonitoring.dashboard.severity'),
    type: 'string',
    typeArgs: {
      getValue(row: SituationsRow) {
        return row.monitor.get('severity');
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
        return row.monitor.get('issueTriggered') === 1 ? 'Yes' : 'No';
      }
    }
  }
];

const Situations: React.FC<SituationsProps> = ({ snapshotId, timeConfig }) => {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'monitors'), [snapshotId]);
  if (!data) {
    return null;
  }
  const monitorData = (data as SnapshotData).get('raw_payload');
  const rows: SituationsRow[] = [];
  monitorData
    .keySeq()
    .toArray()
    .map((key: string) => {
      if (key !== 'itemIds') {
        monitorData.get(key).forEach((monitor: any) => {
          const monitorId = monitor.get('monitorId');
          const situationEntry: any = {
            key: monitorId,
            snapshotId,
            timeConfig,
            monitor
          };
          rows.push(situationEntry);
        });
      }
    });
  if (rows.length === 0) {
    return null;
  }

  return <Table withoutPadding cardTitle={t('in-forge:plugins.fileMonitoring.monitors')} cols={cols} rows={rows} />;
};

export default Situations;
