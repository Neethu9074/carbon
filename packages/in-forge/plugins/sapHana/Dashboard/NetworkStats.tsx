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
import { number, megaBytes, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface NetworkStatsRow {
  key: string;
  snapshotId: string;
  networkStats: Map<string, object>;
}

interface NetworkStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.senderHost'),
    type: 'string',
    typeArgs: {
      getValue(row: NetworkStatsRow) {
        return row.networkStats.get('senderHost');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.senderPort'),
    type: 'string',
    typeArgs: {
      getValue(row: NetworkStatsRow) {
        return row.networkStats.get('senderPort');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.receiverHost'),
    type: 'string',
    typeArgs: {
      getValue(row: NetworkStatsRow) {
        return row.networkStats.get('receiverHost');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.receiverPort'),
    type: 'string',
    typeArgs: {
      getValue(row: NetworkStatsRow) {
        return row.networkStats.get('receiverPort');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.requestCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: NetworkStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: NetworkStatsRow) {
        return `networkStats.${row.key}.requestCount`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function NetworkStatsList({ snapshotId, timeConfig }: NetworkStatsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'networkStats', timeConfig),
    [snapshotId, timeConfig]
  );
  const networkStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: NetworkStatsRow[] = networkStat
    ? networkStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const networkStats = networkStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            networkStats
          };
        })
    : [];
  function getDetails(row: NetworkStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`networkStats.${row.key}.sendSize`, `networkStats.${row.key}.receiveSize`],
                labels: [
                  t('in-forge:plugins.sapHana.dashboard.sendSize'),
                  t('in-forge:plugins.sapHana.dashboard.receiveSize')
                ],
                type: 'line',
                formatter: megaBytes.detailed
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
                metrics: [`networkStats.${row.key}.sendDuration`, `networkStats.${row.key}.receiveDuration`],
                labels: [
                  t('in-forge:plugins.sapHana.dashboard.sendDuration'),
                  t('in-forge:plugins.sapHana.dashboard.receiveDuration')
                ],
                type: 'line',
                formatter: millis.detailed
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
                metrics: [`networkStats.${row.key}.requestCount`],
                labels: [t('in-forge:plugins.sapHana.dashboard.requestCount')],
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
      cardTitle={t('in-forge:plugins.sapHana.dashboard.networkStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={4}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
