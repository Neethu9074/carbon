/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
// @ts-expect-error Module needs to be translated to TS
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import Code from 'in-components/Code/Code';
import { t } from 'in-i18n';

interface SqlPlanCacheStatsRow {
  key: string;
  snapshotId: string;
  sqlPlanCacheStats: Map<string, object>;
}

interface SqlPlanCacheStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: SqlPlanCacheStatsRow) {
        return row.sqlPlanCacheStats.get('userName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.schemaName'),
    type: 'string',
    typeArgs: {
      getValue(row: SqlPlanCacheStatsRow) {
        return row.sqlPlanCacheStats.get('schemaName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.executionCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: SqlPlanCacheStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: SqlPlanCacheStatsRow) {
        return `sqlPlanCacheStats.${row.key}.executionCount`;
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
      getSnapshotId(row: SqlPlanCacheStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: SqlPlanCacheStatsRow) {
        return `sqlPlanCacheStats.${row.key}.avgExecutionTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function SqlPlanCacheStatsList({ snapshotId, timeConfig }: SqlPlanCacheStatsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'sqlPlanCacheStats', timeConfig),
    [snapshotId, timeConfig]
  );
  const sqlPlanCacheStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: SqlPlanCacheStatsRow[] = sqlPlanCacheStat
    ? sqlPlanCacheStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const sqlPlanCacheStats = sqlPlanCacheStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            sqlPlanCacheStats
          };
        })
    : [];
  function extractQuery(row: SqlPlanCacheStatsRow) {
    return row.key
      ? formatSql(row.sqlPlanCacheStats.get('statementString'))
      : t('in-forge:plugins.sapHana.dashboard.errorMessage');
  }

  function getDetails(row: SqlPlanCacheStatsRow) {
    return (
      <div>
        <Code code={extractQuery(row)} lang="sql" softWrap />
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`sqlPlanCacheStats.${row.key}.avgExecutionTime`],
                labels: [t('in-forge:plugins.sapHana.dashboard.avgExecutionTime')],
                type: 'line',
                formatter: millis.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`sqlPlanCacheStats.${row.key}.executionCount`],
                labels: [t('in-forge:plugins.sapHana.dashboard.executionCount')],
                type: 'line',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.sqlPlanCacheStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={3}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
