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
import { number, seconds } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

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
  }
];

export default function WorkProcessListMetric({ snapshotId, timeConfig }: WorkProcessProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'workprocessList'), [snapshotId]);
  if (!data) {
    return null;
  }
  const wpList = (data as SnapshotData).get('raw_payload', []);
  const rows: WorkProcessRow[] = wpList
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
    });

  function getDetails(row: WorkProcessRow) {
    return (
      <div>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: [
              `workprocessList.${row.key}.wpIStatus`,
              `workprocessList.${row.key}.wpDumps`,
              `workprocessList.${row.key}.wpIType`,
              `workprocessList.${row.key}.wpRestart`
            ],
            labels: [
              t('in-sap:dashboards.workProcessStatus'),
              t('in-sap:dashboards.workProcessDumps'),
              t('in-sap:dashboards.workProcessType'),
              t('in-sap:dashboards.workProcessRestart')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
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
          y2={{
            min: 0,
            formatter: number.compact,
            metrics: [`workprocessList.${row.key}.wpMutex`],
            labels: [t('in-sap:dashboards.workProcessMutex')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </div>
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
    />
  );
}
