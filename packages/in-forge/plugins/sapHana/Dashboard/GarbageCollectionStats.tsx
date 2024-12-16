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
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface GarbageCollectionStatsRow {
  key: string;
  snapshotId: string;
  garbageCollectionStats: Map<string, object>;
}

interface GarbageCollectionStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: GarbageCollectionStatsRow) {
        return row.garbageCollectionStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.port'),
    type: 'string',
    typeArgs: {
      getValue(row: GarbageCollectionStatsRow) {
        return row.garbageCollectionStats.get('port');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.volumeId'),
    type: 'string',
    typeArgs: {
      getValue(row: GarbageCollectionStatsRow) {
        return row.garbageCollectionStats.get('volumeId');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.storeType'),
    type: 'string',
    typeArgs: {
      getValue(row: GarbageCollectionStatsRow) {
        return row.garbageCollectionStats.get('storeType');
      }
    }
  }
];

export default function GarbageCollectionStatsList({ snapshotId, timeConfig }: GarbageCollectionStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'garbageCollectionStats'), [snapshotId]);
  const garbageCollectionStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: GarbageCollectionStatsRow[] = garbageCollectionStat
    ? garbageCollectionStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const garbageCollectionStats = garbageCollectionStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            garbageCollectionStats
          };
        })
    : [];

  function getDetails(row: GarbageCollectionStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [
                  `garbageCollectionStats.${row.key}.historyCount`,
                  `garbageCollectionStats.${row.key}.waiterCount`
                ],
                labels: [
                  t('in-forge:plugins.sapHana.dashboard.historyCount'),
                  t('in-forge:plugins.sapHana.dashboard.waiterCount')
                ],
                type: 'line',
                formatter: number.compact
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
                  `garbageCollectionStats.${row.key}.startedJobs`,
                  `garbageCollectionStats.${row.key}.processedJobs`
                ],
                labels: [
                  t('in-forge:plugins.sapHana.dashboard.startedJobs'),
                  t('in-forge:plugins.sapHana.dashboard.processedJobs')
                ],
                type: 'line',
                formatter: number.compact
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
                metrics: [`garbageCollectionStats.${row.key}.queueLoads`],
                labels: [t('in-forge:plugins.sapHana.dashboard.queueLoads')],
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
      cardTitle={t('in-forge:plugins.sapHana.dashboard.garbageCollectionStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
    />
  );
}
