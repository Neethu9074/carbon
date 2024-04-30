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
import { number, millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface LockWaitStatsRow {
  key: string;
  snapshotId: string;
  lockWaitStats: Map<string, object>;
}

interface LockWaitStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: LockWaitStatsRow) {
        return row.lockWaitStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.port'),
    type: 'string',
    typeArgs: {
      getValue(row: LockWaitStatsRow) {
        return row.lockWaitStats.get('port');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.lockType'),
    type: 'string',
    typeArgs: {
      getValue(row: LockWaitStatsRow) {
        return row.lockWaitStats.get('lockType');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.totalLockWaits'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: LockWaitStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: LockWaitStatsRow) {
        return `lockWaitStats.${row.key}.totalLockWaits`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.totalLockWaitTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: LockWaitStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: LockWaitStatsRow) {
        return `lockWaitStats.${row.key}.totalLockWaitTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function LockWaitStatsList({ snapshotId, timeConfig }: LockWaitStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'lockWaitStats'), [snapshotId]);
  if (!data) {
    return null;
  }
  const lockWaitStat = (data as SnapshotData).get('raw_payload', []);
  const rows: LockWaitStatsRow[] = lockWaitStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const lockWaitStats = lockWaitStat.get(key);

      return {
        key,
        snapshotId,
        timeConfig,
        lockWaitStats
      };
    });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.lockWaitStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={3}
      initialSortDirection="desc"
    />
  );
}
