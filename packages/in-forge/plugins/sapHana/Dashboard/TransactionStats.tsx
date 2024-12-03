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
// @ts-expect-error needs TS migration
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection/DashboardSection';
import { formatDateTime } from 'in-services/formatters/date';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

interface TransactionStatsRow {
  key: string;
  snapshotId: string;
  transactionStats: Map<string, object>;
}

interface TransactionStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: TransactionStatsRow) {
        return row.transactionStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.port'),
    type: 'string',
    typeArgs: {
      getValue(row: TransactionStatsRow) {
        return row.transactionStats.get('port');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.transactionId'),
    type: 'string',
    typeArgs: {
      getValue(row: TransactionStatsRow) {
        return row.transactionStats.get('transactionId');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.transactionType'),
    type: 'string',
    typeArgs: {
      getValue(row: TransactionStatsRow) {
        return row.transactionStats.get('transactionType');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.transactionStatus'),
    type: 'string',
    typeArgs: {
      getValue(row: TransactionStatsRow) {
        return row.transactionStats.get('transactionStatus');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.acquiredLockCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: TransactionStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: TransactionStatsRow) {
        return `transactionStats.${row.key}.acquiredLockCount`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.activeStatementCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: TransactionStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: TransactionStatsRow) {
        return `transactionStats.${row.key}.activeStatementCount`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.startTime'),
    type: 'string',
    typeArgs: {
      getValue(row: TransactionStatsRow) {
        return row.transactionStats.get('startTime');
      },
      getContent: formatDateTime
    }
  }
];
function getDetails(row: TransactionStatsRow) {
  return (
    <DashboardSection>
      <label>{t('in-forge:plugins.sapHana.dashboard.connectionId')} : </label>
      <Code
        code={formatSql(
          row.transactionStats.get('connectionId') == null ? '' : row.transactionStats.get('connectionId')
        )}
        lang="bash"
        softWrap
      />
      <label>{t('in-forge:plugins.sapHana.dashboard.currentStatementId')} : </label>
      <Code
        code={formatSql(
          row.transactionStats.get('currentStatementId') == null ? '' : row.transactionStats.get('currentStatementId')
        )}
        lang="bash"
        softWrap
        withExpandButton
      />
    </DashboardSection>
  );
}

export default function TransactionStatsList({ snapshotId, timeConfig }: TransactionStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'transactionStats'), [snapshotId]);
  const transactionStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: TransactionStatsRow[] = transactionStat
    ? transactionStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const transactionStats = transactionStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            transactionStats
          };
        })
    : [];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.transactionStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={6}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
