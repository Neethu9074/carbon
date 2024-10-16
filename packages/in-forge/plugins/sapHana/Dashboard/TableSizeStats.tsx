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
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, megaBytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface TableSizeStatsRow {
  key: string;
  snapshotId: string;
  tableSizeStats: Map<string, object>;
}

interface TableSizeStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.schemaName'),
    type: 'string',
    typeArgs: {
      getValue(row: TableSizeStatsRow) {
        return row.tableSizeStats.get('schemaName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.tableName'),
    type: 'string',
    typeArgs: {
      getValue(row: TableSizeStatsRow) {
        return row.tableSizeStats.get('tableName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.tableType'),
    type: 'string',
    typeArgs: {
      getValue(row: TableSizeStatsRow) {
        return row.tableSizeStats.get('tableType');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.tableSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: TableSizeStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: TableSizeStatsRow) {
        return `tableSizeStats.${row.key}.tableSize`;
      },
      getContent: megaBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.recordCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: TableSizeStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: TableSizeStatsRow) {
        return `tableSizeStats.${row.key}.recordCount`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function TableSizeStatsList({ snapshotId, timeConfig }: TableSizeStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'tableSizeStats'), [snapshotId]);
  const tableSizeStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: TableSizeStatsRow[] = tableSizeStat
    ? tableSizeStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const tableSizeStats = tableSizeStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            tableSizeStats
          };
        })
    : [];
  function getDetails(row: TableSizeStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`tableSizeStats.${row.key}.tableSize`],
                labels: [t('in-forge:plugins.sapHana.dashboard.tableSize')],
                type: 'line',
                formatter: megaBytes.detailed
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
                metrics: [`tableSizeStats.${row.key}.recordCount`],
                labels: [t('in-forge:plugins.sapHana.dashboard.recordCount')],
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
      cardTitle={t('in-forge:plugins.sapHana.dashboard.tableSize')}
      cols={cols}
      rows={rows}
      initialSortColumn={3}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
