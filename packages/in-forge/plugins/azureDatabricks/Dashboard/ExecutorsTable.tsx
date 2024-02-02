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

const nameCol = {
  title: t('in-forge:plugins.azureDatabricks.labelExecutorName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.key;
    }
  }
};

const deSerializationCpuTimeCol = {
  title: t('in-forge:plugins.azureDatabricks.labelDeSerializationCpuTime'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'executors.' + row.key + '.deSerializationCpuTime';
    },
    getContent: percentagePlainTwoDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const serializationCpuTimeCol = {
  title: t('in-forge:plugins.azureDatabricks.labelSerializationCpuTime'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'executors.' + row.key + '.serializationCpuTime';
    },
    getContent: percentagePlainTwoDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
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
  title: t('in-forge:plugins.azureDatabricks.shuffleClientUsedDirectMemory'),
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
  title: t('in-forge:plugins.azureDatabricks.shuffleClientUsedHeapMemory'),
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

export default function GetDatabricksExecutors({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;
  const rows = snapshot
    .getIn(['data'], List())
    .map((executor: Map<string, any>, name: string) => {
      if (name.startsWith('executors') && name.endsWith('name')) {
        return {
          key: executor,
          timeConfig,
          snapshotId
        };
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
    nameCol,
    deSerializationCpuTimeCol,
    serializationCpuTimeCol,
    executorCpuTimeCol,
    shuffleClientUsedDirectMemoryCol,
    shuffleClientUsedHeapMemoryCol,
    jvmCpuTimeCol
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
      initialSortColumn={cols.indexOf(nameCol)}
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
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: [
            'executors.' + row.key + '.shuffleClientUsedDirectMemory',
            'executors.' + row.key + '.shuffleClientUsedHeapMemory'
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
          metrics: ['executors.' + row.key + '.jvmCpuTime', 'executors.' + row.key + '.executorCpuTime'],
          labels: [
            t('in-forge:plugins.azureDatabricks.labelJvmCpuTime'),
            t('in-forge:plugins.azureDatabricks.labelExecutorCpuTime')
          ],
          type: 'line',
          formatter: percentagePlainTwoDecimalPlaces
        }}
      />
    </div>
  );
}
