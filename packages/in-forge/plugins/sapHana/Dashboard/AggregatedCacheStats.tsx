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
import { number, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface AggregatedCacheStatsRow {
  key: string;
  snapshotId: string;
  aggregatedCacheStats: Map<string, object>;
}

interface AggregatedCacheStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: AggregatedCacheStatsRow) {
        return row.aggregatedCacheStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.port'),
    type: 'string',
    typeArgs: {
      getValue(row: AggregatedCacheStatsRow) {
        return row.aggregatedCacheStats.get('port');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.volumeId'),
    type: 'string',
    typeArgs: {
      getValue(row: AggregatedCacheStatsRow) {
        return row.aggregatedCacheStats.get('volumeId');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.cacheId'),
    type: 'string',
    typeArgs: {
      getValue(row: AggregatedCacheStatsRow) {
        return row.aggregatedCacheStats.get('cacheId');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.usedSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: AggregatedCacheStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: AggregatedCacheStatsRow) {
        return `aggregatedCacheStats.${row.key}.usedSize`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.totalSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: AggregatedCacheStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: AggregatedCacheStatsRow) {
        return `aggregatedCacheStats.${row.key}.totalSize`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function AggregatedCacheStatsList({ snapshotId, timeConfig }: AggregatedCacheStatsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'aggregatedCacheStats', timeConfig),
    [snapshotId, timeConfig]
  );
  const aggregatedCacheStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: AggregatedCacheStatsRow[] = aggregatedCacheStat
    ? aggregatedCacheStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const aggregatedCacheStats = aggregatedCacheStat.get(key);

          return {
            key,
            snapshotId,
            timeConfig,
            aggregatedCacheStats
          };
        })
    : [];
  function getDetails(row: AggregatedCacheStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`aggregatedCacheStats.${row.key}.usedSize`, `aggregatedCacheStats.${row.key}.totalSize`],
                labels: [
                  t('in-forge:plugins.sapHana.dashboard.usedSize'),
                  t('in-forge:plugins.sapHana.dashboard.totalSize')
                ],
                type: 'line',
                formatter: bytesTwoDecimalPlaces
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
                metrics: [
                  `aggregatedCacheStats.${row.key}.entryCount`,
                  `aggregatedCacheStats.${row.key}.insertCount`,
                  `aggregatedCacheStats.${row.key}.invalidateCount`,
                  `aggregatedCacheStats.${row.key}.hitCount`,
                  `aggregatedCacheStats.${row.key}.missCount`
                ],
                labels: [
                  t('in-forge:plugins.sapHana.dashboard.entryCount'),
                  t('in-forge:plugins.sapHana.dashboard.insertCount'),
                  t('in-forge:plugins.sapHana.dashboard.invalidateCount'),
                  t('in-forge:plugins.sapHana.dashboard.hitCount'),
                  t('in-forge:plugins.sapHana.dashboard.missCount')
                ],
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
      cardTitle={t('in-forge:plugins.sapHana.dashboard.aggregatedCacheStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={4}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
