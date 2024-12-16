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
import { bytes, number, percentage } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface MemoryStatsRow {
  key: string;
  snapshotId: string;
  memoryStats: Map<string, object>;
}

interface MemoryStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.name'),
    type: 'string',
    typeArgs: {
      getValue(row: MemoryStatsRow) {
        return row.memoryStats.get('name');
      }
    }
  },
  {
    title: t('in-sap:dashboards.allocSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: MemoryStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: MemoryStatsRow) {
        return `bufferMetrics.${row.key}.allocSize`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.availSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: MemoryStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: MemoryStatsRow) {
        return `bufferMetrics.${row.key}.availSize`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.request'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: MemoryStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: MemoryStatsRow) {
        return `bufferMetrics.${row.key}.request`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.hit'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: MemoryStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: MemoryStatsRow) {
        return `bufferMetrics.${row.key}.hit`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },

  {
    title: t('in-sap:dashboards.hitRatio'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: MemoryStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: MemoryStatsRow) {
        return `bufferMetrics.${row.key}.hitRatio`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.swap'),
    type: 'string',
    typeArgs: {
      getValue(row: MemoryStatsRow) {
        return row.memoryStats.get('swap');
      }
    }
  },
  {
    title: t('in-sap:dashboards.usage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: MemoryStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: MemoryStatsRow) {
        return `bufferMetrics.${row.key}.usePercent`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function BufferStatistics({ snapshotId, timeConfig }: MemoryStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'bufferMetrics'), [snapshotId]);
  if (!data) {
    return null;
  }
  const memoryStat = (data as SnapshotData).get('raw_payload', []);
  const rows: MemoryStatsRow[] = memoryStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const memoryStats = memoryStat.get(key);

      return {
        key,
        snapshotId,
        timeConfig,
        memoryStats
      };
    });

  function getDetails(row: MemoryStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`bufferMetrics.${row.key}.allocSize`, `bufferMetrics.${row.key}.availSize`],
                labels: [t('in-sap:dashboards.allocSize'), t('in-sap:dashboards.availSize')],
                type: 'line',
                formatter: bytes.detailed
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
                metrics: [`bufferMetrics.${row.key}.hitRatio`, `bufferMetrics.${row.key}.dbQuality`],
                labels: [t('in-sap:dashboards.hitRatio'), t('in-sap:dashboards.dbQuality')],
                type: 'line',
                formatter: number.detailed
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
                  `bufferMetrics.${row.key}.insert`,
                  `bufferMetrics.${row.key}.update`,
                  `bufferMetrics.${row.key}.delete`
                ],
                labels: [t('in-sap:dashboards.insert'), t('in-sap:dashboards.update'), t('in-sap:dashboards.delete')],
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
      cardTitle={t('in-sap:dashboards.bufferStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={7}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
