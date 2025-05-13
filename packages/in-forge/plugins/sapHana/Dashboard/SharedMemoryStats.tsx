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
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface SharedMemoryStatsRow {
  key: string;
  snapshotId: string;
  sharedMemoryStats: Map<string, object>;
}

interface SharedMemoryStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: SharedMemoryStatsRow) {
        return row.sharedMemoryStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.port'),
    type: 'string',
    typeArgs: {
      getValue(row: SharedMemoryStatsRow) {
        return row.sharedMemoryStats.get('port');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.category'),
    type: 'string',
    typeArgs: {
      getValue(row: SharedMemoryStatsRow) {
        return row.sharedMemoryStats.get('category');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.allocatedSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: SharedMemoryStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: SharedMemoryStatsRow) {
        return `sharedMemoryStats.${row.key}.allocatedSize`;
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
      getSnapshotId(row: SharedMemoryStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: SharedMemoryStatsRow) {
        return `sharedMemoryStats.${row.key}.freeSize`;
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
      getSnapshotId(row: SharedMemoryStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: SharedMemoryStatsRow) {
        return `sharedMemoryStats.${row.key}.usedSize`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function SharedMemoryStatsList({ snapshotId, timeConfig }: SharedMemoryStatsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'sharedMemoryStats', timeConfig),
    [snapshotId, timeConfig]
  );
  const sharedMemoryStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: SharedMemoryStatsRow[] = sharedMemoryStat
    ? sharedMemoryStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const sharedMemoryStats = sharedMemoryStat.get(key);

          return {
            key,
            snapshotId,
            timeConfig,
            sharedMemoryStats
          };
        })
    : [];
  function getDetails(row: SharedMemoryStatsRow) {
    return (
      <div>
        <DashboardSection>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                `sharedMemoryStats.${row.key}.allocatedSize`,
                `sharedMemoryStats.${row.key}.freeSize`,
                `sharedMemoryStats.${row.key}.usedSize`
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
      cardTitle={t('in-forge:plugins.sapHana.dashboard.sharedMemoryStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={5}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
