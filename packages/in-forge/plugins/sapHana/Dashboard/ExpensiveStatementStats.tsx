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
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { formatDateTime } from 'in-services/formatters/date';
import Columize from 'in-sdk/components/dashboard/Columize';
import { millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import Code from 'in-components/Code/Code';
import { t } from 'in-i18n';

interface ExpensiveStatementStatsRow {
  key: string;
  snapshotId: string;
  expensiveStatementStats: Map<string, object>;
}

interface ExpensiveStatementStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: ExpensiveStatementStatsRow) {
        return row.expensiveStatementStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.dbUser'),
    type: 'string',
    typeArgs: {
      getValue(row: ExpensiveStatementStatsRow) {
        return row.expensiveStatementStats.get('dbUser');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.startDateAndTime'),
    type: 'string',
    typeArgs: {
      getValue(row: ExpensiveStatementStatsRow) {
        return row.expensiveStatementStats.get('startDateAndTime');
      },
      getContent: formatDateTime
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.executionTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: ExpensiveStatementStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: ExpensiveStatementStatsRow) {
        return `expensiveStatementStats.${row.key}.executionTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ExpensiveStatementStatsList({ snapshotId, timeConfig }: ExpensiveStatementStatsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'expensiveStatementStats', timeConfig),
    [snapshotId, timeConfig]
  );
  const expensiveStatementStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: ExpensiveStatementStatsRow[] = expensiveStatementStat
    ? expensiveStatementStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const expensiveStatementStats = expensiveStatementStat.get(key);

          return {
            key,
            snapshotId,
            timeConfig,
            expensiveStatementStats
          };
        })
    : [];
  function extractQuery(row: ExpensiveStatementStatsRow) {
    return row.key
      ? formatSql(row.expensiveStatementStats.get('statementString'))
      : t('in-forge:plugins.sapHana.dashboard.errorMessage');
  }

  function getDetails(row: ExpensiveStatementStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Code code={extractQuery(row)} lang="sql" softWrap />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.expensiveStatementStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={3}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
