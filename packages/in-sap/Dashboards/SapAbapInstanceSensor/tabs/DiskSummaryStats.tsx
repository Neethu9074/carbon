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
import { number, seconds, percentage } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
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
  },
  {
    title: t('in-sap:dashboards.transferKB'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DiskStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: DiskStatsRow) {
        return `diskSummaryStats.${row.key}.kbPerSec`;
      },
      getContent: number.perSecond.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.operations'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DiskStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: DiskStatsRow) {
        return `diskSummaryStats.${row.key}.operationsPerSec`;
      },
      getContent: number.perSecond.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.usage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DiskStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: DiskStatsRow) {
        return `diskSummaryStats.${row.key}.util`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
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
                metrics: [`diskSummaryStats.${row.key}.avgQueueLength`],
                labels: [t('in-sap:dashboards.avgQueueLength')],
                type: 'line',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title={t('in-sap:dashboards.operationsTimings')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: seconds.detailed,
                metrics: [
                  `diskSummaryStats.${row.key}.response`,
                  `diskSummaryStats.${row.key}.avgServiceTime`,
                  `diskSummaryStats.${row.key}.avgWaitTime`
                ],
                labels: [
                  t('in-sap:dashboards.responseTime'),
                  t('in-sap:dashboards.serviceTime'),
                  t('in-sap:dashboards.avgWaitTime')
                ],
                type: 'line'
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
                labels: [t('in-sap:dashboards.transferKB'), t('in-sap:dashboards.operations')],
                type: 'line',
                formatter: number.perSecond.compact
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
      initialSortColumn={5}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
