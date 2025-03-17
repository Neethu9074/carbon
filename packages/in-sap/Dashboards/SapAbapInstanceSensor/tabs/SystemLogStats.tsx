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
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

interface SystemLogStatsRow {
  key: string;
  snapshotId: string;
  systemLogStats: Map<string, object>;
}

interface SystemLogStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemLogStatsRow) {
        return row.systemLogStats.get('client');
      }
    }
  },
  {
    title: t('in-sap:dashboards.user'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemLogStatsRow) {
        return row.systemLogStats.get('user');
      }
    }
  },
  {
    title: t('in-sap:dashboards.instance'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemLogStatsRow) {
        return row.systemLogStats.get('instance');
      }
    }
  },
  {
    title: t('in-sap:dashboards.messageId'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemLogStatsRow) {
        return row.systemLogStats.get('messageId');
      }
    }
  },
  {
    title: t('in-sap:dashboards.component'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemLogStatsRow) {
        return row.systemLogStats.get('component');
      }
    }
  },
  {
    title: t('in-sap:dashboards.logCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: SystemLogStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: SystemLogStatsRow) {
        return `systemLogStats.${row.key}.count`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.messageText'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemLogStatsRow) {
        return shorten(row.systemLogStats.get('messageText') as any, 64);
      }
    }
  }
];

export default function SystemLogStats({ snapshotId, timeConfig }: SystemLogStatsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'systemLogStats', timeConfig),
    [snapshotId, timeConfig]
  );
  if (!data) {
    return null;
  }
  const systemLogStat = (data as SnapshotData).get('raw_payload', []);
  const rows: SystemLogStatsRow[] = systemLogStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const systemLogStats = systemLogStat.get(key);

      return {
        key,
        snapshotId,
        timeConfig,
        systemLogStats
      };
    });

  const rowSev1: SystemLogStatsRow[] = rows.filter(row => Number(row.systemLogStats.get('severity')) === 1);
  const rowSev2: SystemLogStatsRow[] = rows.filter(row => Number(row.systemLogStats.get('severity')) === 2);

  function getDetails(row: SystemLogStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`systemLogStats.${row.key}.count`],
                labels: [t('in-sap:dashboards.logCount')],
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
    <DashboardSection title={t('in-sap:dashboards.systemLogStatistics')}>
      {rowSev1.length !== 0 && (
        <Table
          withoutPadding
          cardTitle={t('in-sap:dashboards.severity1')}
          cols={cols}
          rows={rowSev1}
          initialSortColumn={5}
          initialSortDirection="desc"
          getRowDetails={getDetails}
        />
      )}

      {rowSev2.length !== 0 && (
        <Table
          withoutPadding
          cardTitle={t('in-sap:dashboards.severity2')}
          cols={cols}
          rows={rowSev2}
          initialSortColumn={5}
          initialSortDirection="desc"
          getRowDetails={getDetails}
        />
      )}
    </DashboardSection>
  );
}
