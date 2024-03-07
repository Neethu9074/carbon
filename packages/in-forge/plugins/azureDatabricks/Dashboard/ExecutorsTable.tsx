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
      return row.executorName;
    }
  }
};

const clusterNameCol = {
  title: t('in-forge:plugins.azureDatabricks.labelClusterName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.clusterName;
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
      return row.key + '.executorCpuTime';
    },
    getContent: percentagePlainTwoDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const shuffleClientUsedDirectMemoryCol = {
  title: t('in-forge:plugins.azureDatabricks.shuffleClientUsedDirectMemory'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return row.key + '.shuffleClientUsedDirectMemory';
    },
    getContent: bytesTwoDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const shuffleClientUsedHeapMemoryCol = {
  title: t('in-forge:plugins.azureDatabricks.shuffleClientUsedHeapMemory'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return row.key + '.shuffleClientUsedHeapMemory';
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
      return row.key + '.jvmCpuTime';
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

  if (configuredLogAnalytics != 'OK') {
    return null;
  }

  const snapshotId = snapshot.get('id') as string;
  const uniqueKeys = new Set();

  const rows = snapshot
    .getIn(['data'], List())
    .map((_value: string, key: string) => {
      if (key.startsWith('executors')) {
        const prefix = key.substring(0, key.lastIndexOf('.'));
        if (!uniqueKeys.has(prefix)) {
          uniqueKeys.add(prefix);

          return {
            key: prefix,
            clusterName: snapshot.getIn(['data', prefix + '.clusterName']),
            executorName: snapshot.getIn(['data', prefix + '.executorName']),
            timeConfig,
            snapshotId
          };
        }
      }
      return null;
    })
    .valueSeq()
    .toArray()
    .filter(Boolean);

  if (rows.length === 0) {
    return null;
  }
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
          metrics: [
            'executors.' + row.executorName + '.jvmCpuTime',
            'executors.' + row.executorName + '.executorCpuTime'
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
            'executors.' + row.executorName + '.shuffleClientUsedDirectMemory',
            'executors.' + row.executorName + '.shuffleClientUsedHeapMemory'
          ],
          labels: [
            t('in-forge:plugins.azureDatabricks.shuffleClientUsedDirectMemory'),
            t('in-forge:plugins.azureDatabricks.shuffleClientUsedHeapMemory')
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
            'executors.' + row.executorName + '.deSerializationCpuTime',
            'executors.' + row.executorName + '.serializationCpuTime'
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
