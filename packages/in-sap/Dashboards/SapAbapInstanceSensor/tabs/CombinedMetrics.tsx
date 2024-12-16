/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { millis } from 'in-services/formatters/number';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface UserStatsRow {
  key: string;
  snapshotId: string;
  userStats: Map<string, object>;
}

interface UserStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: UserStatsRow) {
        return row.userStats.get('account');
      }
    }
  },
  {
    title: t('in-sap:dashboards.combinedCpuTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: UserStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: UserStatsRow) {
        return `combinedMetrics.${row.key}.totalCpuTimePerUser`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CombinedMetrics({ snapshotId, timeConfig }: UserStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'combinedMetrics'), [snapshotId]);
  if (!data) {
    return null;
  }
  const userStat = (data as SnapshotData).get('raw_payload', []);
  const rows: UserStatsRow[] = userStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const userStats = userStat.get(key);

      return {
        key,
        snapshotId,
        timeConfig,
        userStats
      };
    })
    .filter((row: UserStatsRow) => {
      const userValue = row.userStats.get('account');
      return typeof userValue === 'string' && userValue !== 'UNKNOWN';
    });

  function getDetails(row: UserStatsRow) {
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
                  `combinedMetrics.${row.key}.totalResponseTimePerUser`,
                  `combinedMetrics.${row.key}.totalProcessingTimePerUser`,
                  `combinedMetrics.${row.key}.totalCpuTimePerUser`,
                  `combinedMetrics.${row.key}.totalQueueTimePerUser`,
                  `combinedMetrics.${row.key}.totalRollWaitTimePerUser`
                ],
                labels: [
                  t('in-sap:dashboards.combinedResponseTime'),
                  t('in-sap:dashboards.processingTime'),
                  t('in-sap:dashboards.combinedCpuTime'),
                  t('in-sap:dashboards.combinedQueueTime'),
                  t('in-sap:dashboards.combinedRollWaitTime')
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
      cardTitle={t('in-sap:dashboards.combinedCpuMetrics')}
      cols={cols}
      rows={rows}
      initialSortColumn={1}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
