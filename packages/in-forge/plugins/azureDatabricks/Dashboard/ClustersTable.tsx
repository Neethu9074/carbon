/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { List } from 'immutable';
import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { megaBytes, number, bytes, seconds } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const clusterNameCol = {
  title: t('in-forge:plugins.azureDatabricks.labelClusterName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.key;
    }
  }
};

const clusterIdCol = {
  title: t('in-forge:plugins.azureDatabricks.labelClusterId'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.snapshot.getIn(['data', 'clusters.' + row.key + '.clusterId']);
    }
  }
};

const sparkVersionCol = {
  title: t('in-forge:plugins.azureDatabricks.labelSparkVersion'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.snapshot.getIn(['data', 'clusters.' + row.key + '.sparkVersion']);
    }
  }
};

const clusterCoreCol = {
  title: t('in-forge:plugins.azureDatabricks.labelClusterCore'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.snapshot.getIn(['data', 'clusters.' + row.key + '.clusterCore']);
    }
  }
};

const clusterSourceCol = {
  title: t('in-forge:plugins.azureDatabricks.labelClusterSource'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.snapshot.getIn(['data', 'clusters.' + row.key + '.clusterSource']);
    }
  }
};

const executorCountCol = {
  title: t('in-forge:plugins.azureDatabricks.labelExecutorCount'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'clusters.' + row.key + '.executorCount';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const clusterMemoryCol = {
  title: t('in-forge:plugins.azureDatabricks.labelClusterMemory'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'clusters.' + row.key + '.clusterMemoryMb';
    },
    getContent: megaBytes.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const jobCountCol = {
  title: t('in-forge:plugins.azureDatabricks.labelJobCount'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'clusters.' + row.key + '.jobCount';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

export default function ClustersTable({
  snapshot,
  configuredLogAnalytics
}: {
  snapshot: SnapshotData;
  configuredLogAnalytics: string;
}) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;

  const clusterNames = snapshot.getIn(['data', 'clusterNames'], List());
  if (clusterNames.length == 0) {
    return null;
  }

  const rows = clusterNames.toArray().map((clusterName: string) => {
    return {
      key: clusterName,
      snapshot: snapshot,
      configuredLogAnalytics: configuredLogAnalytics,
      timeConfig,
      snapshotId
    };
  });

  const cols = [
    clusterNameCol,
    clusterIdCol,
    sparkVersionCol,
    clusterCoreCol,
    clusterSourceCol,
    executorCountCol,
    jobCountCol,
    clusterMemoryCol
  ];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureDatabricks.titleClusters', {
        len: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      initialSortColumn={cols.indexOf(clusterNameCol)}
    />
  );
}

function getRowDetails(row: any) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <>
      <Columize>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['clusters.' + row.key + '.executorCount'],
            labels: [t('in-forge:plugins.azureDatabricks.labelExecutorCount')],
            type: 'line',
            formatter: number.compact
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['clusters.' + row.key + '.jobCount'],
            labels: [t('in-forge:plugins.azureDatabricks.labelJobCount')],
            type: 'line',
            formatter: number.compact
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['clusters.' + row.key + '.clusterMemoryMb'],
            labels: [t('in-forge:plugins.azureDatabricks.labelClusterMemory')],
            type: 'line',
            formatter: megaBytes.compact
          }}
        />
      </Columize>

      {row.configuredLogAnalytics == 'OK' && (
        <>
          <Columize>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['clusters.' + row.key + '.maxShuffleBytesWritten'],
                labels: [t('in-forge:plugins.azureDatabricks.labelMaxShuffleBytesWritten')],
                type: 'line',
                formatter: bytes.compact
              }}
            />
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['clusters.' + row.key + '.sumShuffleClientUsedHeapMemory'],
                labels: [t('in-forge:plugins.azureDatabricks.labelSumShuffleClientUsedHeapMemory')],
                type: 'line',
                formatter: bytes.compact
              }}
            />
          </Columize>
          <Columize>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['clusters.' + row.key + '.executionDuration'],
                labels: [t('in-forge:plugins.azureDatabricks.labelExecutionDuration')],
                type: 'line',
                formatter: seconds.fixedCompact
              }}
            />
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['clusters.' + row.key + '.inputRowsPerSecond'],
                labels: [t('in-forge:plugins.azureDatabricks.labelInputRowPerSecond')],
                type: 'line',
                formatter: number.compact
              }}
            />
          </Columize>
        </>
      )}
    </>
  );
}
