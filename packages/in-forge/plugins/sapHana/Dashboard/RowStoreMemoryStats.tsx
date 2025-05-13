/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { bytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface RowStoreMemoryStatsRow {
  key: string;
  snapshotId: string;
  rowStoreMemoryStats: Map<string, object>;
}

interface RowStoreMemoryStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: RowStoreMemoryStatsRow) {
        return row.rowStoreMemoryStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.port'),
    type: 'string',
    typeArgs: {
      getValue(row: RowStoreMemoryStatsRow) {
        return row.rowStoreMemoryStats.get('port');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.category'),
    type: 'string',
    typeArgs: {
      getValue(row: RowStoreMemoryStatsRow) {
        return row.rowStoreMemoryStats.get('category');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.allocatedSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: RowStoreMemoryStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: RowStoreMemoryStatsRow) {
        return `rowStoreMemoryStats.${row.key}.allocatedSize`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.freeSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: RowStoreMemoryStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: RowStoreMemoryStatsRow) {
        return `rowStoreMemoryStats.${row.key}.freeSize`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.usedSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: RowStoreMemoryStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: RowStoreMemoryStatsRow) {
        return `rowStoreMemoryStats.${row.key}.usedSize`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.usedPercentage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: RowStoreMemoryStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: RowStoreMemoryStatsRow) {
        return `rowStoreMemoryStats.${row.key}.usedPercentage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function RowStoreMemoryStatsList({ snapshotId, timeConfig }: RowStoreMemoryStatsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'rowStoreMemoryStats', timeConfig),
    [snapshotId, timeConfig]
  );
  const rowStoreMemoryStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: RowStoreMemoryStatsRow[] = rowStoreMemoryStat
    ? rowStoreMemoryStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const rowStoreMemoryStats = rowStoreMemoryStat.get(key);

          return {
            key,
            snapshotId,
            timeConfig,
            rowStoreMemoryStats
          };
        })
    : [];
  function getDetails(row: RowStoreMemoryStatsRow) {
    return (
      <div>
        <DashboardSection>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                `rowStoreMemoryStats.${row.key}.allocatedSize`,
                `rowStoreMemoryStats.${row.key}.freeSize`,
                `rowStoreMemoryStats.${row.key}.usedSize`
              ],
              labels: [
                t('in-forge:plugins.sapHana.dashboard.allocatedSize'),
                t('in-forge:plugins.sapHana.dashboard.freeSize'),
                t('in-forge:plugins.sapHana.dashboard.usedSize')
              ],
              type: 'line',
              formatter: bytesTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </div>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.rowStoreMemoryStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={6}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
