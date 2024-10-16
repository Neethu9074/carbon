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
import { formatDateTime } from 'in-services/formatters/date';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface UserLockStatsRow {
  key: string;
  snapshotId: string;
  userLockStats: Map<string, object>;
}

interface UserLockStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.userId'),
    type: 'string',
    typeArgs: {
      getValue(row: UserLockStatsRow) {
        return row.userLockStats.get('userId');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: UserLockStatsRow) {
        return row.userLockStats.get('userName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.userMode'),
    type: 'string',
    typeArgs: {
      getValue(row: UserLockStatsRow) {
        return row.userLockStats.get('userMode');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.deactivationTime'),
    type: 'string',
    typeArgs: {
      getValue(row: UserLockStatsRow) {
        return row.userLockStats.get('deactivationTime');
      },
      getContent: formatDateTime
    }
  }
];

export default function UserLockStatsList({ snapshotId, timeConfig }: UserLockStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'userLockStats'), [snapshotId]);
  const userLockStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: UserLockStatsRow[] = userLockStat
    ? userLockStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const userLockStats = userLockStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            userLockStats
          };
        })
    : [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.userLockStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={3}
      initialSortDirection="desc"
    />
  );
}
