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
// @ts-expect-error Module needs to be translated to TS
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { bytesTwoDecimalPlaces, millis, number } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import Code from 'in-components/Code/Code';
import { t } from 'in-i18n';

interface ActiveStatementStatsRow {
  key: string;
  snapshotId: string;
  activeStatementStats: Map<string, object>;
}

interface ActiveStatementStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: ActiveStatementStatsRow) {
        return row.activeStatementStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.port'),
    type: 'string',
    typeArgs: {
      getValue(row: ActiveStatementStatsRow) {
        return row.activeStatementStats.get('port');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.status'),
    type: 'string',
    typeArgs: {
      getValue(row: ActiveStatementStatsRow) {
        return row.activeStatementStats.get('statementStatus');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.usedMemorySize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: ActiveStatementStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: ActiveStatementStatsRow) {
        return `activeStatementStats.${row.key}.usedMemorySize`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.executionCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: ActiveStatementStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: ActiveStatementStatsRow) {
        return `activeStatementStats.${row.key}.executionCount`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.avgExecutionTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: ActiveStatementStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: ActiveStatementStatsRow) {
        return `activeStatementStats.${row.key}.avgExecutionTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ActiveStatementStatsList({ snapshotId, timeConfig }: ActiveStatementStatsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'activeStatementStats', timeConfig),
    [snapshotId, timeConfig]
  );
  const activeStatementStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: ActiveStatementStatsRow[] = activeStatementStat
    ? activeStatementStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const activeStatementStats = activeStatementStat.get(key);

          return {
            key,
            snapshotId,
            timeConfig,
            activeStatementStats
          };
        })
    : [];

  function getDetails(row: ActiveStatementStatsRow) {
    return (
      <DashboardSection>
        <label>{t('in-forge:plugins.sapHana.dashboard.statementString')} : </label>
        <Code
          code={formatSql(
            row.activeStatementStats.get('statementString') == null
              ? ''
              : row.activeStatementStats.get('statementString')
          )}
          lang="sql"
          softWrap
        />
        <label>{t('in-forge:plugins.sapHana.dashboard.planId')} : </label>
        <Code
          code={formatSql(row.activeStatementStats.get('planId') == null ? '' : row.activeStatementStats.get('planId'))}
          lang="bash"
          softWrap
          withExpandButton
        />
        <label>{t('in-forge:plugins.sapHana.dashboard.statementId')} : </label>
        <Code
          code={formatSql(
            row.activeStatementStats.get('statementId') == null ? '' : row.activeStatementStats.get('statementId')
          )}
          lang="bash"
          softWrap
          withExpandButton
        />
      </DashboardSection>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.activeStatementStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={5}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
