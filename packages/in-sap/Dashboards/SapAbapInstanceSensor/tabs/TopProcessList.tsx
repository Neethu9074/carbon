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
import { kiloBytes, seconds } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface TopProcessStatsRow {
  key: string;
  snapshotId: string;
  topProcessStats: Map<string, object>;
}

interface TopProcessStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.procId'),
    type: 'string',
    typeArgs: {
      getValue(row: TopProcessStatsRow) {
        return row.topProcessStats.get('procId');
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: TopProcessStatsRow) {
        return row.topProcessStats.get('userName');
      }
    }
  },
  {
    title: t('in-sap:dashboards.command'),
    type: 'string',
    typeArgs: {
      getValue(row: TopProcessStatsRow) {
        return row.topProcessStats.get('command');
      }
    }
  },
  {
    title: t('in-sap:dashboards.priority'),
    type: 'string',
    typeArgs: {
      getValue(row: TopProcessStatsRow) {
        return row.topProcessStats.get('priority');
      }
    }
  }
];

export default function TopProcessList({ snapshotId, timeConfig }: TopProcessStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'topProcessMetricStats'), [snapshotId]);
  if (!data) {
    return null;
  }
  const topProcessStat = (data as SnapshotData).get('raw_payload', []);
  const rows: TopProcessStatsRow[] = topProcessStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const topProcessStats = topProcessStat.get(key);

      return {
        key,
        snapshotId,
        timeConfig,
        topProcessStats
      };
    });

  function getDetails(row: TopProcessStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`topProcessMetricStats.${row.key}.cpuTime`],
                labels: [t('in-sap:dashboards.cpuTime')],
                type: 'line',
                formatter: seconds.detailed
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />

            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`topProcessMetricStats.${row.key}.resSize`],
                labels: [t('in-sap:dashboards.resSize')],
                type: 'line',
                formatter: kiloBytes.compact
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
      cardTitle={t('in-sap:dashboards.TopProcessList')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
    />
  );
}
