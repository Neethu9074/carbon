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
import { number, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface LockWaitStatsRow {
  key: string;
  snapshotId: string;
  lockWaitStats: Map<string, object>;
}

interface LockWaitStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: LockWaitStatsRow) {
        return row.lockWaitStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.port'),
    type: 'string',
    typeArgs: {
      getValue(row: LockWaitStatsRow) {
        return row.lockWaitStats.get('port');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.lockType'),
    type: 'string',
    typeArgs: {
      getValue(row: LockWaitStatsRow) {
        return row.lockWaitStats.get('lockType');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.totalLockWaits'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: LockWaitStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: LockWaitStatsRow) {
        return `lockWaitStats.${row.key}.totalLockWaits`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.totalLockWaitTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: LockWaitStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: LockWaitStatsRow) {
        return `lockWaitStats.${row.key}.totalLockWaitTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function LockWaitStatsList({ snapshotId, timeConfig }: LockWaitStatsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'lockWaitStats', timeConfig),
    [snapshotId, timeConfig]
  );
  const lockWaitStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: LockWaitStatsRow[] = lockWaitStat
    ? lockWaitStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const lockWaitStats = lockWaitStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            lockWaitStats
          };
        })
    : [];
  function getDetails(row: LockWaitStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`lockWaitStats.${row.key}.totalLockWaits`],
                labels: [t('in-forge:plugins.sapHana.dashboard.totalLockWaits')],
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
                metrics: [`lockWaitStats.${row.key}.totalLockWaitTime`],
                labels: [t('in-forge:plugins.sapHana.dashboard.totalLockWaitTime')],
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
      cardTitle={t('in-forge:plugins.sapHana.dashboard.lockWaitStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={3}
      getRowDetails={getDetails}
      initialSortDirection="desc"
    />
  );
}
