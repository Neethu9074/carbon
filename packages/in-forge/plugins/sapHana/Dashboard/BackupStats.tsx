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
import { bytesTwoDecimalPlaces, millis } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface BackupStatsRow {
  key: string;
  snapshotId: string;
  backupStats: Map<string, object>;
}

interface BackupStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: BackupStatsRow) {
        return row.backupStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.port'),
    type: 'string',
    typeArgs: {
      getValue(row: BackupStatsRow) {
        return row.backupStats.get('port');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.serviceName'),
    type: 'string',
    typeArgs: {
      getValue(row: BackupStatsRow) {
        return row.backupStats.get('serviceName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.backupId'),
    type: 'string',
    typeArgs: {
      getValue(row: BackupStatsRow) {
        return row.backupStats.get('backupId');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.entryType'),
    type: 'string',
    typeArgs: {
      getValue(row: BackupStatsRow) {
        return row.backupStats.get('entryType');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.status'),
    type: 'string',
    typeArgs: {
      getValue(row: BackupStatsRow) {
        return row.backupStats.get('stateName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.startTime'),
    type: 'string',
    typeArgs: {
      getValue(row: BackupStatsRow) {
        return row.backupStats.get('startTime');
      },
      getContent: formatDateTime
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.duration'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: BackupStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: BackupStatsRow) {
        return `backupStats.${row.key}.duration`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.backupSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: BackupStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: BackupStatsRow) {
        return `backupStats.${row.key}.backupSize`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.transferredSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: BackupStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: BackupStatsRow) {
        return `backupStats.${row.key}.transferredSize`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function BackupStatsList({ snapshotId, timeConfig }: BackupStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'backupStats'), [snapshotId]);
  const backupStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: BackupStatsRow[] = backupStat
    ? backupStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const backupStats = backupStat.get(key);

          return {
            key,
            snapshotId,
            timeConfig,
            backupStats
          };
        })
    : [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.backupStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={8}
      initialSortDirection="desc"
    />
  );
}
