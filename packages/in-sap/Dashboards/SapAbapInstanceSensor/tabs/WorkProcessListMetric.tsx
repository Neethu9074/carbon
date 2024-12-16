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
import { workProcessStatusMap } from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/WorkProcessStatus';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Table';
import { number, seconds } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/ComboBox.mless';

interface WorkProcessRow {
  key: string;
  snapshotId: string;
  workprocessList: Map<string, object>;
}

interface WorkProcessProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.workProcessNumber'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: WorkProcessRow) {
        return row.snapshotId;
      },
      getMetricName(row: WorkProcessRow) {
        return `workprocessList.${row.key}.wpIndex`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.wpPID'),
    type: 'string',
    typeArgs: {
      getValue(row: WorkProcessRow) {
        return row.workprocessList.get('pid');
      }
    }
  },
  {
    title: t('in-sap:dashboards.workProcessStatus'),
    type: 'string',
    typeArgs: {
      getValue(row: WorkProcessRow) {
        return row.workprocessList.get('wpStatus');
      }
    }
  },
  {
    title: t('in-sap:dashboards.workProcessType'),
    type: 'string',
    typeArgs: {
      getValue(row: WorkProcessRow) {
        return row.workprocessList.get('wpType');
      }
    }
  },
  {
    title: t('in-sap:dashboards.restarted'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: WorkProcessRow) {
        return row.snapshotId;
      },
      getMetricName(row: WorkProcessRow) {
        return `workprocessList.${row.key}.wpRestart`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.numberOfDumps'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: WorkProcessRow) {
        return row.snapshotId;
      },
      getMetricName(row: WorkProcessRow) {
        return `workprocessList.${row.key}.wpDumps`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.cpuUsage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: WorkProcessRow) {
        return row.snapshotId;
      },
      getMetricName(row: WorkProcessRow) {
        return `workprocessList.${row.key}.wpCPU`;
      },
      getContent: seconds.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function WorkProcessListMetric({ snapshotId, timeConfig }: WorkProcessProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'workprocessList'), [snapshotId]);
  // @ts-expect-error Module needs to be translated to TS
  const [{ wpStatus }, setPhase] = useState(workProcessStatusMap);

  const rightHeader = (
    <ComboBox
      placeholder={t('in-sap:dashboards.status')}
      isSearchable={false}
      value={wpStatus}
      className={locals.filter}
      // @ts-expect-error Module needs to be translated to TS
      onChange={t => setPhase({ wpStatus: t ? t.value : null })}
      options={workProcessStatusMap}
    />
  );

  if (!data) {
    return null;
  }
  const wpList = (data as SnapshotData).get('raw_payload', []);

  let rows: WorkProcessRow[] = wpList
    .keySeq()
    .toArray()
    .map((key: string) => {
      const workprocessList = wpList.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        workprocessList
      };
    })
    .filter(function (rows: WorkProcessRow) {
      if (wpStatus == null) {
        return rows;
      } else {
        return rows != null && rows.workprocessList.get('wpStatus') === wpStatus;
      }
    });

  function getDetails(row: WorkProcessRow) {
    return (
      <Columize>
        <DashboardSection>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [
                `workprocessList.${row.key}.wpIStatus`,
                `workprocessList.${row.key}.wpDumps`,
                `workprocessList.${row.key}.wpRestart`
              ],
              labels: [
                t('in-sap:dashboards.workProcessStatus'),
                t('in-sap:dashboards.workProcessDumps'),
                t('in-sap:dashboards.workProcessRestart')
              ],
              type: 'line'
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
              formatter: number.compact,
              metrics: [`workprocessList.${row.key}.wpMutex`],
              labels: [t('in-sap:dashboards.workProcessMutex')],
              type: 'line'
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
              formatter: seconds.detailed,
              metrics: [`workprocessList.${row.key}.wpCPU`],
              labels: [t('in-sap:dashboards.workProcessCpu')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    );
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.workProcessStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
      rightHeader={rightHeader}
    />
  );
}
