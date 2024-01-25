/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
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
import { number, seconds } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface DiskStatsRow {
  key: string;
  snapshotId: string;
  diskStats: Map<string, object>;
}

interface DiskSummaryDataStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.diskName'),
    type: 'string',
    typeArgs: {
      getValue(row: DiskStatsRow) {
        return row.diskStats.get('diskName');
      }
    }
  },
  {
    title: t('in-sap:dashboards.type'),
    type: 'string',
    typeArgs: {
      getValue(row: DiskStatsRow) {
        return row.diskStats.get('type');
      }
    }
  },
  {
    title: t('in-sap:dashboards.subType'),
    type: 'string',
    typeArgs: {
      getValue(row: DiskStatsRow) {
        return row.diskStats.get('subType');
      }
    }
  }
];

export default function DiskSummaryStats({ snapshotId, timeConfig }: DiskSummaryDataStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'diskSummaryStats'), [snapshotId]);
  if (!data) {
    return null;
  }
  const diskStat = (data as SnapshotData).get('raw_payload', []);
  const rows: DiskStatsRow[] = diskStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const diskStats = diskStat.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        diskStats
      };
    });

  function getDetails(row: DiskStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection title={t('in-sap:dashboards.performanceStats')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`diskSummaryStats.${row.key}.avgQueueLength`, `diskSummaryStats.${row.key}.response`],
                labels: [t('in-sap:dashboards.avgQueueLength'), t('in-sap:dashboards.response')],
                type: 'line',
                formatter: number.compact
              }}
              y2={{
                min: 0,
                metrics: [`diskSummaryStats.${row.key}.avgWaitTime`],
                labels: [t('in-sap:dashboards.avgWaitTime')],
                type: 'line',
                formatter: seconds.detailed
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title={t('in-sap:dashboards.diskOperations')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`diskSummaryStats.${row.key}.kbPerSec`, `diskSummaryStats.${row.key}.operationsPerSec`],
                labels: [t('in-sap:dashboards.kbPerSec'), t('in-sap:dashboards.operationsPerSec')],
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
      cardTitle={t('in-sap:dashboards.diskSummaryStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
    />
  );
}
