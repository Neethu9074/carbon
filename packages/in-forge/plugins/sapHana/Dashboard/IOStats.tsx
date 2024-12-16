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
import { bytesTwoDecimalPlaces, millis, number } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface IOStatsRow {
  key: string;
  snapshotId: string;
  ioStats: Map<string, object>;
}

interface IOStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: IOStatsRow) {
        return row.ioStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.port'),
    type: 'string',
    typeArgs: {
      getValue(row: IOStatsRow) {
        return row.ioStats.get('port');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.volumeId'),
    type: 'string',
    typeArgs: {
      getValue(row: IOStatsRow) {
        return row.ioStats.get('volumeId');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.fileType'),
    type: 'string',
    typeArgs: {
      getValue(row: IOStatsRow) {
        return row.ioStats.get('type');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.fileSystemPath'),
    type: 'string',
    typeArgs: {
      getValue(row: IOStatsRow) {
        return row.ioStats.get('path');
      }
    }
  }
];

export default function IOStatsList({ snapshotId, timeConfig }: IOStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'ioStats'), [snapshotId]);
  const ioStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: IOStatsRow[] = ioStat
    ? ioStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const ioStats = ioStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            ioStats
          };
        })
    : [];

  function getDetails(row: IOStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`ioStats.${row.key}.totalReadSize`, `ioStats.${row.key}.totalWriteSize`],
                labels: [
                  t('in-forge:plugins.sapHana.dashboard.totalReadSize'),
                  t('in-forge:plugins.sapHana.dashboard.totalWriteSize')
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
                metrics: [`ioStats.${row.key}.totalFailedReads`, `ioStats.${row.key}.totalFailedWrites`],
                labels: [
                  t('in-forge:plugins.sapHana.dashboard.totalFailedReads'),
                  t('in-forge:plugins.sapHana.dashboard.totalFailedWrites')
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
                metrics: [`ioStats.${row.key}.totalReadTime`, `ioStats.${row.key}.totalWriteTime`],
                labels: [
                  t('in-forge:plugins.sapHana.dashboard.totalReadTime'),
                  t('in-forge:plugins.sapHana.dashboard.totalWriteTime')
                ],
                type: 'line',
                formatter: millis.detailed
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
      cardTitle={t('in-forge:plugins.sapHana.dashboard.ioStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
    />
  );
}
