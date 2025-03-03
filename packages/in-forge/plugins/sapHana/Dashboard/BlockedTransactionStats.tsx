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
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

interface BlockedTransactionStatsRow {
  key: string;
  snapshotId: string;
  blockedTransactionStats: Map<string, object>;
}

interface BlockedTransactionStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: BlockedTransactionStatsRow) {
        return row.blockedTransactionStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.port'),
    type: 'string',
    typeArgs: {
      getValue(row: BlockedTransactionStatsRow) {
        return row.blockedTransactionStats.get('port');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.waitingSchemaName'),
    type: 'string',
    typeArgs: {
      getValue(row: BlockedTransactionStatsRow) {
        return row.blockedTransactionStats.get('waitingSchemaName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.waitingTableName'),
    type: 'string',
    typeArgs: {
      getValue(row: BlockedTransactionStatsRow) {
        return row.blockedTransactionStats.get('waitingTableName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.lockType'),
    type: 'string',
    typeArgs: {
      getValue(row: BlockedTransactionStatsRow) {
        return row.blockedTransactionStats.get('lockType');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.lockMode'),
    type: 'string',
    typeArgs: {
      getValue(row: BlockedTransactionStatsRow) {
        return row.blockedTransactionStats.get('lockMode');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.blockedTime'),
    type: 'string',
    typeArgs: {
      getValue(row: BlockedTransactionStatsRow) {
        return row.blockedTransactionStats.get('blockedTime');
      },
      getContent: formatDateTime
    }
  }
];
function getDetails(row: BlockedTransactionStatsRow) {
  return (
    <>
      <DashboardSection>
        <Columize>
          <label>{t('in-forge:plugins.sapHana.dashboard.blockedConnectionId')} :</label>
          <Code
            code={formatSql(
              row.blockedTransactionStats.get('blockedConnectionId') == null
                ? ''
                : row.blockedTransactionStats.get('blockedConnectionId')
            )}
            lang="bash"
            softWrap
            withExpandButton
          />
          <label>{t('in-forge:plugins.sapHana.dashboard.lockOwnerConnectionId')} :</label>
          <Code
            code={formatSql(
              row.blockedTransactionStats.get('lockOwnerConnectionId') == null
                ? ''
                : row.blockedTransactionStats.get('lockOwnerConnectionId')
            )}
            lang="bash"
            softWrap
            withExpandButton
          />
        </Columize>

        <Columize>
          <label>{t('in-forge:plugins.sapHana.dashboard.blockedTransactionId')} :</label>
          <Code
            code={formatSql(
              row.blockedTransactionStats.get('blockedTransactionId') == null
                ? ''
                : row.blockedTransactionStats.get('blockedTransactionId')
            )}
            lang="bash"
            softWrap
            withExpandButton
          />
          <label>{t('in-forge:plugins.sapHana.dashboard.lockOwnerTransactionId')} :</label>
          <Code
            code={formatSql(
              row.blockedTransactionStats.get('lockOwnerTransactionId') == null
                ? ''
                : row.blockedTransactionStats.get('lockOwnerTransactionId')
            )}
            lang="bash"
            softWrap
            withExpandButton
          />
        </Columize>
        <label>{t('in-forge:plugins.sapHana.dashboard.waitingRecordId')} :</label>
        <Code
          code={formatSql(
            row.blockedTransactionStats?.get('waitingRecordId') != null
              ? String(row.blockedTransactionStats.get('waitingRecordId')).replace(/\s+/g, ',').replace(/,/g, ' ')
              : ''
          )}
          lang="sql"
          softWrap
          withExpandButton
        />
      </DashboardSection>
    </>
  );
}

export default function BlockedTransactionStatsList({ snapshotId, timeConfig }: BlockedTransactionStatsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'blockedTransactionStats', timeConfig),
    [snapshotId, timeConfig]
  );
  const transactionStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: BlockedTransactionStatsRow[] = transactionStat
    ? transactionStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const blockedTransactionStats = transactionStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            blockedTransactionStats
          };
        })
    : [];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.blockedTransactionStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={6}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
