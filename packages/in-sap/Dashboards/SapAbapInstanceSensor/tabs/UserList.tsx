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
import { number, millis, bytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface UserListRow {
  key: string;
  snapshotId: string;
  userStats: Map<string, object>;
}

interface UserListProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.account'),
    type: 'string',
    typeArgs: {
      getValue(row: UserListRow) {
        return row.userStats.get('account');
      }
    }
  },
  {
    title: t('in-sap:dashboards.entryID'),
    type: 'string',
    typeArgs: {
      getValue(row: UserListRow) {
        return row.userStats.get('entryID');
      }
    }
  }
];

export default function UserList({ snapshotId, timeConfig }: UserListProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'userList'), [snapshotId]);
  if (!data) {
    return null;
  }
  const userStat = (data as SnapshotData).get('raw_payload', []);
  const rows: UserListRow[] = userStat
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
    });

  function getDetails(row: UserListRow) {
    return (
      <div>
        <Columize>
          <DashboardSection title={t('in-sap:dashboards.userStats')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`userList.${row.key}.LUW_COUNT`, `userList.${row.key}.DCOUNT`],
                labels: [t('in-sap:dashboards.count'), t('in-sap:dashboards.dcount')],
                type: 'line',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title={t('in-sap:dashboards.bytesRequested')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`userList.${row.key}.bytesRequested`],
                labels: [t('in-sap:dashboards.bytesRequested')],
                type: 'line',
                formatter: bytes.detailed
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-sap:dashboards.performanceStats')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [
                  `userList.${row.key}.RESPTIME`,
                  `userList.${row.key}.CPUTIME`,
                  `userList.${row.key}.QUEUETIME`,
                  `userList.${row.key}.ROLLWAITTIME`,
                  `userList.${row.key}.IOWAITTIME`
                ],
                labels: [
                  t('in-sap:dashboards.responseTime'),
                  t('in-sap:dashboards.cpuTime'),
                  t('in-sap:dashboards.userListQueueTime'),
                  t('in-sap:dashboards.userListRollWaitTime'),
                  t('in-sap:dashboards.userListIOWaitTime')
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
      cardTitle={t('in-sap:dashboards.userStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
    />
  );
}
