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
import Table from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Table';
import ComboBox from 'in-components/ComboBox/ComboBox';
import { bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/ComboBox.mless';

interface TotalMemoryRow {
  key: string;
  snapshotId: string;
  memoryStats: Map<string, object>;
}

interface TotalMemoryProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: TotalMemoryRow) {
        return row.memoryStats.get('client');
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: TotalMemoryRow) {
        return row.memoryStats.get('account');
      }
    }
  },
  {
    title: t('in-sap:dashboards.taskType'),
    type: 'string',
    typeArgs: {
      getValue(row: TotalMemoryRow) {
        return row.memoryStats.get('taskType');
      }
    }
  },
  {
    title: t('in-sap:dashboards.entryID'),
    type: 'string',
    typeArgs: {
      getValue(row: TotalMemoryRow) {
        return row.memoryStats.get('entryID');
      }
    }
  },
  {
    title: t('in-sap:dashboards.privateMemory'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: TotalMemoryRow) {
        return row.snapshotId;
      },
      getMetricName(row: TotalMemoryRow) {
        return `memoryStats.${row.key}.privsum`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.extendedUsedBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: TotalMemoryRow) {
        return row.snapshotId;
      },
      getMetricName(row: TotalMemoryRow) {
        return `memoryStats.${row.key}.usedBytes`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.maxBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: TotalMemoryRow) {
        return row.snapshotId;
      },
      getMetricName(row: TotalMemoryRow) {
        return `memoryStats.${row.key}.maxBytes`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.totalMemory'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: TotalMemoryRow) {
        return row.snapshotId;
      },
      getMetricName(row: TotalMemoryRow) {
        return `memoryStats.${row.key}.memSum`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function TotalMemory({ snapshotId, timeConfig }: TotalMemoryProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'memoryStats', timeConfig),
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
  const memoryStat = (data as SnapshotData).get('raw_payload', []);
  const rows: TotalMemoryRow[] = memoryStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const memoryStats = memoryStat.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        memoryStats
      };
    })
    .filter((row: TotalMemoryRow) => {
      const userValue = row.memoryStats.get('account');
      return typeof userValue === 'string' && userValue !== 'UNKNOWN';
    })
    .filter(function (rows: TotalMemoryRow) {
      if (taskType == null) {
        return rows;
      } else if (taskType == 'Others') {
        const taskType = rows.memoryStats.get('taskType');
        return rows != null && typeof taskType === 'string' && !taskTypeList.includes(taskType);
      } else {
        return rows != null && rows.memoryStats.get('taskType') === taskType;
      }
    });

  function getDetails(row: TotalMemoryRow) {
    return (
      <div>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytes.compact,
            metrics: [
              `memoryStats.${row.key}.memSum`,
              `memoryStats.${row.key}.privsum`,
              `memoryStats.${row.key}.usedBytes`,
              `memoryStats.${row.key}.maxBytes`
            ],
            labels: [
              t('in-sap:dashboards.totalMemory'),
              t('in-sap:dashboards.privateMemory'),
              t('in-sap:dashboards.extendedUsedBytes'),
              t('in-sap:dashboards.maxBytes')
            ],
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
      cardTitle={t('in-sap:dashboards.memoryStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={7}
      initialSortDirection="desc"
      getRowDetails={getDetails}
      rightHeader={rightHeader}
    />
  );
}
