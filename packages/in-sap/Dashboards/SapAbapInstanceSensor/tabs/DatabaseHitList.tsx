/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import { taskTypeMap } from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DatabaseHitlistTaskTypes';
// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Table';
import { bytes, millis, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/ComboBox.mless';

interface DatabaseHitListRow {
  key: string;
  snapshotId: string;
  dataStats: Map<string, object>;
}

interface DatabaseHitListProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: DatabaseHitListRow) {
        return row.dataStats.get('client');
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: DatabaseHitListRow) {
        return row.dataStats.get('account');
      }
    }
  },
  {
    title: t('in-sap:dashboards.tCode'),
    type: 'string',
    typeArgs: {
      getValue(row: DatabaseHitListRow) {
        return row.dataStats.get('tCode');
      }
    }
  },
  {
    title: t('in-sap:dashboards.terminalID'),
    type: 'string',
    typeArgs: {
      getValue(row: DatabaseHitListRow) {
        return row.dataStats.get('terminalId');
      }
    }
  },
  {
    title: t('in-sap:dashboards.taskType'),
    type: 'string',
    typeArgs: {
      getValue(row: DatabaseHitListRow) {
        return row.dataStats.get('taskType');
      }
    }
  },
  {
    title: t('in-sap:dashboards.report'),
    type: 'string',
    typeArgs: {
      getValue(row: DatabaseHitListRow) {
        return row.dataStats.get('report');
      }
    }
  },
  {
    title: t('in-sap:dashboards.dbCalls'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DatabaseHitListRow) {
        return row.snapshotId;
      },
      getMetricName(row: DatabaseHitListRow) {
        return `databaseStats.${row.key}.totalDbCalls`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.bytesRequested'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DatabaseHitListRow) {
        return row.snapshotId;
      },
      getMetricName(row: DatabaseHitListRow) {
        return `databaseStats.${row.key}.bytesRequested`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatabaseHitList({ snapshotId, timeConfig }: DatabaseHitListProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'databaseStats'), [snapshotId]);
  const [{ taskType }, setPhase] = useState(taskTypeMap);

  const rightHeader = (
    <ComboBox
      placeholder={t('in-sap:dashboards.taskType')}
      isSearchable={false}
      value={taskType}
      className={locals.filter}
      // @ts-expect-error Module needs to be translated to TS
      onChange={t => setPhase({ taskType: t ? t.value : null })}
      options={taskTypeMap}
    />
  );
  if (!data) {
    return null;
  }
  const dataStat = (data as SnapshotData).get('raw_payload', []);
  const rows: DatabaseHitListRow[] = dataStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const dataStats = dataStat.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        dataStats
      };
    })
    .filter(function (rows: DatabaseHitListRow) {
      if (taskType == null) {
        return rows;
      } else if (taskType == 'Others') {
        return (
          rows != null &&
          // @ts-expect-error Module needs to be translated to TS
          rows.dataStats.get('taskType') != 'RFC' &&
          // @ts-expect-error Module needs to be translated to TS
          rows.dataStats.get('taskType') != 'HTTP' &&
          // @ts-expect-error Module needs to be translated to TS
          rows.dataStats.get('taskType') != 'HTTPS' &&
          // @ts-expect-error Module needs to be translated to TS
          rows.dataStats.get('taskType') != 'BCKGRD' &&
          // @ts-expect-error Module needs to be translated to TS
          rows.dataStats.get('taskType') != 'SPOOL' &&
          // @ts-expect-error Module needs to be translated to TS
          rows.dataStats.get('taskType') != 'UPDATE' &&
          // @ts-expect-error Module needs to be translated to TS
          rows.dataStats.get('taskType') != 'BUF.SYN'
        );
      } else {
        return rows != null && rows.dataStats.get('taskType') === taskType;
      }
    });

  function getDetails(row: DatabaseHitListRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`databaseStats.${row.key}.totalDbRequests`, `databaseStats.${row.key}.totalDbCalls`],
                labels: [t('in-sap:dashboards.totalDbRequests'), t('in-sap:dashboards.dbCalls')],
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
                metrics: [`databaseStats.${row.key}.dbRequestTime`],
                labels: [t('in-sap:dashboards.dbRequestTime')],
                type: 'line',
                formatter: millis.compact
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
                metrics: [`databaseStats.${row.key}.bytesRequested`],
                labels: [t('in-sap:dashboards.bytesRequested')],
                type: 'line',
                formatter: bytes.detailed
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
      cardTitle={t('in-sap:dashboards.databaseHitList')}
      cols={cols}
      rows={rows}
      initialSortColumn={7}
      initialSortDirection="desc"
      getRowDetails={getDetails}
      rightHeader={rightHeader}
    />
  );
}
