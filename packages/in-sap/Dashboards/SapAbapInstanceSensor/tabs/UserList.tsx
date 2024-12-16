/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp, getSnapshot } from 'in-stores/snapshot';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Table';
import { number, millis, bytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import ComboBox, { Option } from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/ComboBox.mless';

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
    title: t('in-sap:dashboards.userName'),
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
  },
  {
    title: t('in-sap:dashboards.taskType'),
    type: 'string',
    typeArgs: {
      getValue(row: UserListRow) {
        return row.userStats.get('TASKTYPE');
      }
    }
  },
  {
    title: t('in-sap:dashboards.cpuTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: UserListRow) {
        return row.snapshotId;
      },
      getMetricName(row: UserListRow) {
        return `userList.${row.key}.CPUTIME`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.responseTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: UserListRow) {
        return row.snapshotId;
      },
      getMetricName(row: UserListRow) {
        return `userList.${row.key}.RESPTIME`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function UserList({ snapshotId, timeConfig }: UserListProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'userList'), [snapshotId]);
  const snapshot = useObservable(getSnapshot(snapshotId, timeConfig), [snapshotId, timeConfig]);
  const [user, setUser] = useState();

  if (!snapshot) {
    return null;
  }

  let users: string[] = ['SAPSYS', 'OTHER'];
  let userName: string = snapshot.get('data').get('user');
  users.unshift(userName);

  if (!data) {
    return null;
  }
  const userStat = (data as SnapshotData).get('raw_payload', []);

  function mapUsers() {
    const userOptions: Option[] = users.map(item => ({
      label: item,
      value: item
    }));

    return userOptions;
  }

  const rightHeader = (
    <ComboBox
      placeholder={t('in-sap:dashboards.userName')}
      isSearchable={false}
      value={user}
      className={locals.filter}
      // @ts-expect-error
      onChange={t => setUser(t ? t.value : null)}
      options={mapUsers()}
    />
  );

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
    })
    .filter((row: UserListRow) => {
      const userValue = row.userStats.get('account');
      return typeof userValue === 'string' && userValue !== 'UNKNOWN';
    })
    .filter(function (rows: UserListRow) {
      if (user == null) {
        return rows;
      } else if (user == 'OTHER') {
        let nameOfUser: any = rows.userStats.get('account');
        return rows != null && nameOfUser != 'SAPSYS' && typeof userName === 'string' && nameOfUser != userName;
      } else {
        return rows != null && typeof user === 'string' && rows.userStats.get('account') === user;
      }
    });

  function getDetails(row: UserListRow) {
    return (
      <div>
        <Columize>
          <DashboardSection title={t('in-sap:dashboards.processSteps')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [
                  `userList.${row.key}.LUW_COUNT`,
                  `userList.${row.key}.DCOUNT`,
                  `userList.${row.key}.BCOUNT`,
                  `userList.${row.key}.UCOUNT`,
                  `userList.${row.key}.SCOUNT`,
                  `userList.${row.key}.ECOUNT`
                ],
                labels: [
                  t('in-sap:dashboards.luw'),
                  t('in-sap:dashboards.dcount'),
                  t('in-sap:dashboards.bcount'),
                  t('in-sap:dashboards.ucount'),
                  t('in-sap:dashboards.scount'),
                  t('in-sap:dashboards.ecount')
                ],
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
                  `userList.${row.key}.PROCTI`,
                  `userList.${row.key}.CPUTIME`,
                  `userList.${row.key}.QUEUETIME`,
                  `userList.${row.key}.ROLLWAITTIME`
                ],
                labels: [
                  t('in-sap:dashboards.responseTime'),
                  t('in-sap:dashboards.processingTime'),
                  t('in-sap:dashboards.cpuTime'),
                  t('in-sap:dashboards.userListQueueTime'),
                  t('in-sap:dashboards.userListRollWaitTime')
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
      initialSortColumn={4}
      initialSortDirection="desc"
      getRowDetails={getDetails}
      rightHeader={rightHeader}
    />
  );
}
