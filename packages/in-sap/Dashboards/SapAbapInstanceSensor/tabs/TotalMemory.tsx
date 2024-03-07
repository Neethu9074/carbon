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
import { bytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

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
    title: t('in-sap:dashboards.entryID'),
    type: 'string',
    typeArgs: {
      getValue(row: TotalMemoryRow) {
        return row.memoryStats.get('entryID');
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
  },
  {
    title: t('in-sap:dashboards.heapMemory'),
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
  }
];

export default function TotalMemory({ snapshotId, timeConfig }: TotalMemoryProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'memoryStats'), [snapshotId]);
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
              t('in-sap:dashboards.heapMemory'),
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
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
    />
  );
}
