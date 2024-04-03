/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { bytesTwoDecimalPlaces, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeConfig } from 'in-types';
import { List } from 'immutable';
import { t } from 'in-i18n';

interface ExecutorRow {
  key: string;
  timeConfig: TimeConfig;
  snapshotId: string;
  snapshot: SnapshotData;
}

const cols = [
  {
    title: t('in-forge:plugins.azureDatabricks.labelExecutorName'),
    type: 'string',
    typeArgs: {
      getValue({ key }: ExecutorRow) {
        return key;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelClusterName'),
    type: 'string',
    typeArgs: {
      getValue({ snapshot, key }: ExecutorRow) {
        return snapshot.getIn(['data', `executors.${key}.clusterName`]);
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelExecutorCpuTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: ExecutorRow) {
        return snapshotId;
      },
      getMetricName({ key }: ExecutorRow) {
        return `executors.${key}.executorCpuTime`;
      },
      getContent: percentagePlainTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelShuffleClientUsedDirectMemory'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: ExecutorRow) {
        return snapshotId;
      },
      getMetricName({ key }: ExecutorRow) {
        return `executors.${key}.shuffleClientUsedDirectMemory`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelShuffleClientUsedHeapMemory'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: ExecutorRow) {
        return snapshotId;
      },
      getMetricName({ key }: ExecutorRow) {
        return `executors.${key}.shuffleClientUsedHeapMemory`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelJvmCpuTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: ExecutorRow) {
        return snapshotId;
      },
      getMetricName({ key }: ExecutorRow) {
        return `executors.${key}.jvmCpuTime`;
      },
      getContent: percentagePlainTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ExecutorsTable({
  snapshot,
  configuredLogAnalytics
}: {
  snapshot: SnapshotData;
  configuredLogAnalytics: string;
}) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;

  if (configuredLogAnalytics != 'OK') {
    return null;
  }

  const executorNames = snapshot.getIn(['data', 'executorNames'], List());
  if (executorNames.length == 0) {
    return null;
  }

  const rows: ExecutorRow[] = executorNames.toArray().map((executorName: string) => {
    return {
      key: executorName,
      timeConfig,
      snapshotId,
      snapshot: snapshot
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureDatabricks.titleExecutorsCount', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row: ExecutorRow) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [
                `executors.${row.key}.jvmCpuTime`,
                `executors.${row.key}.executorCpuTime`
              ],
              labels: [
                t('in-forge:plugins.azureDatabricks.labelJvmCpuTime'),
                t('in-forge:plugins.azureDatabricks.labelExecutorCpuTime')
              ],
              type: 'line',
              formatter: percentagePlainTwoDecimalPlaces
            }}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [
                `executors.${row.key}.shuffleClientUsedDirectMemory`,
                `executors.${row.key}.shuffleClientUsedHeapMemory`
              ],
              labels: [
                t('in-forge:plugins.azureDatabricks.labelShuffleClientUsedDirectMemory'),
                t('in-forge:plugins.azureDatabricks.labelShuffleClientUsedHeapMemory')
              ],
              type: 'line',
              formatter: bytesTwoDecimalPlaces
            }}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [
                `executors.${row.key}.deSerializationCpuTime`,
                `executors.${row.key}.serializationCpuTime`
              ],
              labels: [
                t('in-forge:plugins.azureDatabricks.labelDeSerializationCpuTime'),
                t('in-forge:plugins.azureDatabricks.labelSerializationCpuTime')
              ],
              type: 'line',
              formatter: percentagePlainTwoDecimalPlaces
            }}
          />
        </Columize>
      </>
    </div>
  );
}
