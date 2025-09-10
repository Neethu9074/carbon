/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
// @ts-expect-error Module needs to be translated to TS
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import Code from 'in-components/Code/Code';
import { t } from 'in-i18n';

interface ConnectionsInfoStatsRow {
  key: string;
  snapshotId: string;
  connectionsInfoStats: Map<string, object>;
}

interface ConnectionsInfoStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: ConnectionsInfoStatsRow) {
        return row.connectionsInfoStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.port'),
    type: 'string',
    typeArgs: {
      getValue(row: ConnectionsInfoStatsRow) {
        return row.connectionsInfoStats.get('port');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.connectionId'),
    type: 'string',
    typeArgs: {
      getValue(row: ConnectionsInfoStatsRow) {
        return row.connectionsInfoStats.get('connectionId');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.connectionType'),
    type: 'string',
    typeArgs: {
      getValue(row: ConnectionsInfoStatsRow) {
        return row.connectionsInfoStats.get('connectionType');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.connectionStatus'),
    type: 'string',
    typeArgs: {
      getValue(row: ConnectionsInfoStatsRow) {
        return row.connectionsInfoStats.get('connectionStatus');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.createdBy'),
    type: 'string',
    typeArgs: {
      getValue(row: ConnectionsInfoStatsRow) {
        return row.connectionsInfoStats.get('createdBy');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.startTime'),
    type: 'string',
    typeArgs: {
      getValue(row: ConnectionsInfoStatsRow) {
        return row.connectionsInfoStats.get('startTime');
      }
    }
  }
];

export default function ConnectionsInfoStatsList({ snapshotId, timeConfig }: ConnectionsInfoStatsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'connectionsInfoStats', timeConfig),
    [snapshotId, timeConfig]
  );
  const connectionsInfoStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: ConnectionsInfoStatsRow[] = connectionsInfoStat
    ? connectionsInfoStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const connectionsInfoStats = connectionsInfoStat.get(key);

          return {
            key,
            snapshotId,
            timeConfig,
            connectionsInfoStats
          };
        })
        .filter((row: ConnectionsInfoStatsRow) => {
          const stats = row.connectionsInfoStats;
          return stats.get('host') != null && stats.get('port') != null;
        })
    : [];

  function getDetails(row: ConnectionsInfoStatsRow) {
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
                  `connectionsInfoStats.${row.key}.fetchedRecordCount`,
                  `connectionsInfoStats.${row.key}.affectedRecordCount`
                ],
                labels: [
                  t('in-forge:plugins.sapHana.dashboard.fetchedRecordCount'),
                  t('in-forge:plugins.sapHana.dashboard.affectedRecordCount')
                ],
                type: 'line',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>

          <DashboardSection>
            <label>{t('in-forge:plugins.sapHana.dashboard.userName')} : </label>
            <Code
              code={formatSql(
                row.connectionsInfoStats.get('userName') == null ? '' : row.connectionsInfoStats.get('userName')
              )}
              lang="sql"
              softWrap
            />
            <label>{t('in-forge:plugins.sapHana.dashboard.clientPid')} : </label>
            <Code
              code={formatSql(
                row.connectionsInfoStats.get('clientPid') == null ? '' : row.connectionsInfoStats.get('clientPid')
              )}
              lang="bash"
              softWrap
              withExpandButton
            />
            <label>{t('in-forge:plugins.sapHana.dashboard.idleTime')} : </label>
            <Code
              code={formatSql(
                row.connectionsInfoStats.get('idleTime') == null ? '' : row.connectionsInfoStats.get('idleTime')
              )}
              lang="bash"
              softWrap
              withExpandButton
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.connectionsInfoStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={6}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
