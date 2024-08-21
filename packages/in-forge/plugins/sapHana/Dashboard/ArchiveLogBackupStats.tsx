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

interface ArchiveLogBackupStatsRow {
  key: string;
  snapshotId: string;
  archiveLogBackupStats: Map<string, object>;
}

interface ArchiveLogBackupStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.backupId'),
    type: 'string',
    typeArgs: {
      getValue(row: ArchiveLogBackupStatsRow) {
        return row.archiveLogBackupStats.get('backupId');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.systemId'),
    type: 'string',
    typeArgs: {
      getValue(row: ArchiveLogBackupStatsRow) {
        return row.archiveLogBackupStats.get('systemId');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.volumeId'),
    type: 'string',
    typeArgs: {
      getValue(row: ArchiveLogBackupStatsRow) {
        return row.archiveLogBackupStats.get('volumeId');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.entryType'),
    type: 'string',
    typeArgs: {
      getValue(row: ArchiveLogBackupStatsRow) {
        return row.archiveLogBackupStats.get('entryType');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.startTime'),
    type: 'string',
    typeArgs: {
      getValue(row: ArchiveLogBackupStatsRow) {
        return row.archiveLogBackupStats.get('startTime');
      },
      getContent: formatDateTime
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.sourceDatabaseName'),
    type: 'string',
    typeArgs: {
      getValue(row: ArchiveLogBackupStatsRow) {
        return row.archiveLogBackupStats.get('sourceDatabaseName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.status'),
    type: 'string',
    typeArgs: {
      getValue(row: ArchiveLogBackupStatsRow) {
        return row.archiveLogBackupStats.get('stateName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.duration'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: ArchiveLogBackupStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: ArchiveLogBackupStatsRow) {
        return `archiveLogBackupStats.${row.key}.duration`;
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
      getSnapshotId(row: ArchiveLogBackupStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: ArchiveLogBackupStatsRow) {
        return `archiveLogBackupStats.${row.key}.backupSize`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.destinationPath'),
    type: 'string',
    typeArgs: {
      getValue(row: ArchiveLogBackupStatsRow) {
        return row.archiveLogBackupStats.get('destinationPath');
      }
    }
  }
];

export default function ArchiveLogBackupStatsList({ snapshotId, timeConfig }: ArchiveLogBackupStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'archiveLogBackupStats'), [snapshotId]);
  if (!data) {
    return null;
  }
  const archiveLogBackupStat = (data as SnapshotData).get('raw_payload', []);
  const rows: ArchiveLogBackupStatsRow[] = archiveLogBackupStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const archiveLogBackupStats = archiveLogBackupStat.get(key);

      return {
        key,
        snapshotId,
        timeConfig,
        archiveLogBackupStats
      };
    });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.archiveLogBackupStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={4}
      initialSortDirection="desc"
    />
  );
}
