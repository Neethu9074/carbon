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
  Situation: Map<string, number>;
}

const cols = [
  {
    title: t('in-forge:plugins.FileMonitoring.name'),
    type: 'string',
    typeArgs: {
      getValue(row: SituationsRow) {
        return row.Situation.get('name');
      }
    }
  },
  {
    title: t('in-forge:plugins.FileMonitoring.path'),
    type: 'string',
    typeArgs: {
      getValue(row: SituationsRow) {
        return row.Situation.get('path');
      }
    }
  },
  {
    title: t('in-forge:plugins.FileMonitoring.pollingInterval'),
    type: 'string',
    typeArgs: {
      getValue(row: SituationsRow) {
        return row.Situation.get('pollingInterval');
      }
    }
  },
  {
    title: t('in-forge:plugins.FileMonitoring.severity'),
    type: 'string',
    typeArgs: {
      getValue(row: SituationsRow) {
        return row.Situation.get('severity');
      }
    }
  },
  {
    title: t('in-forge:plugins.FileMonitoring.issueTriggered'),
    type: 'string',
    typeArgs: {
      getValue(row: SituationsRow) {
        return row.Situation.get('issueTriggered');
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

  const rows: SituationsRow[] = monitorData
    .keySeq()
    .toArray()
    .map((key: string) => {
      const Situation = monitorData.get(key);
      return {
        key: String(key),
        snapshotId,
        timeConfig,
        Situation
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.FileMonitoring.dashboard.Situations')}
      cols={cols}
      rows={rows}
    />
  );
};

export default Situations;
