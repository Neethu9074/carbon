/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

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

import locals from 'in-sdk/components/dashboard/DashboardSection/DashboardSection.mless';

interface LanStatsRow {
  key: string;
  snapshotId: string;
  lanStats: Map<string, object>;
}

interface LanStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.type'),
    type: 'string',
    typeArgs: {
      getValue(row: LanStatsRow) {
        return row.lanStats.get('type');
      }
    }
  },
  {
    title: t('in-sap:dashboards.subType'),
    type: 'string',
    typeArgs: {
      getValue(row: LanStatsRow) {
        return row.lanStats.get('subType');
      }
    }
  },
  {
    title: t('in-sap:dashboards.serialNumber'),
    type: 'string',
    typeArgs: {
      getValue(row: LanStatsRow) {
        return row.lanStats.get('serialNumber');
      }
    }
  },
  {
    title: t('in-sap:dashboards.lanName'),
    type: 'string',
    typeArgs: {
      getValue(row: LanStatsRow) {
        return row.lanStats.get('lanName');
      }
    }
  }
];

export default function LanInterface({ snapshotId, timeConfig }: LanStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'lanMetricStats'), [snapshotId]);
  if (!data) {
    return null;
  }
  const lanStat = (data as SnapshotData).get('raw_payload', []);
  const rows: LanStatsRow[] = lanStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const lanStats = lanStat.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        lanStats
      };
    });

  function getDetails(row: LanStatsRow) {
    return (
      <div className={locals.dashboardSection}>
        <Card title={t('in-sap:dashboards.lanMetricStats')}>
          <Columize>
            <DashboardSection>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: [`lanMetricStats.${row.key}.inPackets`, `lanMetricStats.${row.key}.outPackets`],
                  labels: [t('in-sap:dashboards.inPackets'), t('in-sap:dashboards.outPackets')],
                  type: 'stackedBar',
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
                  metrics: [`lanMetricStats.${row.key}.inErrors`, `lanMetricStats.${row.key}.outErrors`],
                  labels: [t('in-sap:dashboards.inErrors'), t('in-sap:dashboards.outErrors')],
                  type: 'stackedBar',
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
                  metrics: [`lanMetricStats.${row.key}.collisions`],
                  labels: [t('in-sap:dashboards.collisions')],
                  type: 'line',
                  formatter: number.compact
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
          </Columize>
        </Card>
      </div>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.lanInterface')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
    />
  );
}
