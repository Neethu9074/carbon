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
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { taskTypeMap, taskTypeList } from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TaskType';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Table';
import { millis, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import ComboBox from 'in-components/ComboBox/ComboBox';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/ComboBox.mless';

interface DbConnectRow {
  key: string;
  snapshotId: string;
  dbStats: Map<string, object>;
}
interface DbConnectProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.taskType'),
    type: 'string',
    typeArgs: {
      getValue(row: DbConnectRow) {
        return row.dbStats.get('taskType');
      }
    }
  },
  {
    title: t('in-sap:dashboards.connectionName'),
    type: 'string',
    typeArgs: {
      getValue(row: DbConnectRow) {
        return row.dbStats.get('connectionName');
      }
    }
  },
  {
    title: t('in-sap:dashboards.entryID'),
    type: 'string',
    typeArgs: {
      getValue(row: DbConnectRow) {
        return row.dbStats.get('entryID');
      }
    }
  },
  {
    title: t('in-sap:dashboards.dbTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DbConnectRow) {
        return row.snapshotId;
      },
      getMetricName(row: DbConnectRow) {
        return `dbConnectionList.${row.key}.dbTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.calls'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DbConnectRow) {
        return row.snapshotId;
      },
      getMetricName(row: DbConnectRow) {
        return `dbConnectionList.${row.key}.totalCalls`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DBConnectionProvider({ snapshotId, timeConfig }: DbConnectProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'dbConnectionList', timeConfig),
    [snapshotId, timeConfig]
  );
  // @ts-expect-error Module needs to be translated to TS
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
  const dbStat = (data as SnapshotData).get('raw_payload', []);
  const rows: DbConnectRow[] = dbStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const dbStats = dbStat.get(key);

      return {
        key,
        snapshotId,
        timeConfig,
        dbStats
      };
    })
    .filter(function (rows: DbConnectRow) {
      if (taskType == null) {
        return rows;
      } else if (taskType == 'Others') {
        const taskType = rows.dbStats.get('taskType');
        return rows != null && typeof taskType === 'string' && !taskTypeList.includes(taskType);
      } else {
        return rows != null && rows.dbStats.get('taskType') === taskType;
      }
    });

  function getDetails(row: DbConnectRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`dbConnectionList.${row.key}.dbTime`],
                labels: [t('in-sap:dashboards.dbTime')],
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
                metrics: [`dbConnectionList.${row.key}.totalCalls`],
                labels: [t('in-sap:dashboards.calls')],
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
      cardTitle={t('in-sap:dashboards.databaseConnection')}
      cols={cols}
      rows={rows}
      initialSortColumn={4}
      initialSortDirection="desc"
      getRowDetails={getDetails}
      rightHeader={rightHeader}
    />
  );
}
