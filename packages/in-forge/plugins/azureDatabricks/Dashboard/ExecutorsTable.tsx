/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { List } from 'immutable';
import React from 'react';

import { bytesTwoDecimalPlaces, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const executorNameCol = {
  title: t('in-forge:plugins.azureDatabricks.labelExecutorName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.key;
    }
  }
};

const clusterNameCol = {
  title: t('in-forge:plugins.azureDatabricks.labelClusterName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.snapshot.getIn(['data', 'executors.' + row.key + '.clusterName']);
    }
  }
};

const executorCpuTimeCol = {
  title: t('in-forge:plugins.azureDatabricks.labelExecutorCpuTime'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'executors.' + row.key + '.executorCpuTime';
    },
    getContent: percentagePlainTwoDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const shuffleClientUsedDirectMemoryCol = {
  title: t('in-forge:plugins.azureDatabricks.labelShuffleClientUsedDirectMemory'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'executors.' + row.key + '.shuffleClientUsedDirectMemory';
    },
    getContent: bytesTwoDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const shuffleClientUsedHeapMemoryCol = {
  title: t('in-forge:plugins.azureDatabricks.labelShuffleClientUsedHeapMemory'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'executors.' + row.key + '.shuffleClientUsedHeapMemory';
    },
    getContent: bytesTwoDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const jvmCpuTimeCol = {
  title: t('in-forge:plugins.azureDatabricks.labelJvmCpuTime'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'executors.' + row.key + '.jvmCpuTime';
    },
    getContent: percentagePlainTwoDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

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

  const rows = executorNames.toArray().map((executorName: string) => {
    return {
      key: executorName,
      timeConfig,
      snapshotId,
      snapshot: snapshot
    };
  });

  const cols = [
    executorNameCol,
    clusterNameCol,
    jvmCpuTimeCol,
    executorCpuTimeCol,
    shuffleClientUsedDirectMemoryCol,
    shuffleClientUsedHeapMemoryCol
  ];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureDatabricks.titleExecutors', {
        len: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      initialSortColumn={cols.indexOf(executorNameCol)}
    />
  );
}

function getRowDetails(row: any) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: ['executors.' + row.key + '.jvmCpuTime', 'executors.' + row.key + '.executorCpuTime'],
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
            'executors.' + row.key + '.shuffleClientUsedDirectMemory',
            'executors.' + row.key + '.shuffleClientUsedHeapMemory'
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
            'executors.' + row.key + '.deSerializationCpuTime',
            'executors.' + row.key + '.serializationCpuTime'
          ],
          labels: [
            t('in-forge:plugins.azureDatabricks.labelDeSerializationCpuTime'),
            t('in-forge:plugins.azureDatabricks.labelSerializationCpuTime')
          ],
          type: 'line',
          formatter: percentagePlainTwoDecimalPlaces
        }}
      />
    </div>
  );
}
