/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface LatencyRow {
  key: string;
  snapshotId: string;
  latency: Map<string, number>;
}

interface WorkerLuaVMProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.kongApigateway.pid'),
    type: 'string',
    typeArgs: {
      getValue(row: LatencyRow) {
        return row.latency.get('pid');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.subsystem'),
    type: 'string',
    typeArgs: {
      getValue(row: LatencyRow) {
        return row.latency.get('subsystem');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.allocatedBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: LatencyRow) {
        return row.snapshotId;
      },
      getMetricName(row: LatencyRow) {
        return `memoryWorkersLuaVmsBytes.${row.key}.bytes`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const WorkerLuaVM = function KongWorkerLuaVM({ snapshotId, timeConfig }: WorkerLuaVMProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'memoryWorkersLuaVmsBytes'), [snapshotId]);

  if (!data) {
    return null;
  }

  const memoryWorkersLuaVmsBytes = (data as SnapshotData).get('raw_payload');
  const rows: LatencyRow[] = memoryWorkersLuaVmsBytes
    .keySeq()
    .toArray()
    .map((key: string) => {
      const latency = memoryWorkersLuaVmsBytes.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        latency
      };
    });

  if (rows.length === 0) {
    return null;
  }
  function getDetails(row: LatencyRow) {
    return (
      <div>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesTwoDecimalPlaces,
            metrics: [`memoryWorkersLuaVmsBytes.${row.key}.bytes`],
            labels: [t('in-forge:plugins.kongApigateway.allocatedBytes')],
            type: 'line'
          }}
        />
      </div>
    );
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.kongApigateway.dashboard.workerLua')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
};

export default WorkerLuaVM;
