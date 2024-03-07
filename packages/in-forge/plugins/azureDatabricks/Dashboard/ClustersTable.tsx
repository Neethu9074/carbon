/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { List } from 'immutable';
import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { megaBytes, number } from 'in-services/formatters/number';
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
      return row.clusterName;
    }
  }
};

const clusterIdCol = {
  title: t('in-forge:plugins.azureDatabricks.labelClusterId'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.clusterId;
    }
  }
};

const sparkVersionCol = {
  title: t('in-forge:plugins.azureDatabricks.labelSparkVersion'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.sparkVersion;
    }
  }
};

const clusterCoreCol = {
  title: t('in-forge:plugins.azureDatabricks.labelClusterCore'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.clusterCore;
    }
  }
};

const clusterSourceCol = {
  title: t('in-forge:plugins.azureDatabricks.labelClusterSource'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.clusterSource;
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
      return 'clusters.' + row.clusterName + '.executorCount';
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
      return 'clusters.' + row.clusterName + '.clusterMemoryMb';
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
      return 'clusters.' + row.clusterName + '.jobCount';
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
  const uniqueKeys = new Set();

  const rows = snapshot
    .getIn(['data'], List())
    .map((_value: string, key: string) => {
      if (key.startsWith('clusters.')) {
        const prefix = key.substring(0, key.lastIndexOf('.'));
        if (!uniqueKeys.has(prefix)) {
          uniqueKeys.add(prefix);

          return {
            key: prefix,
            clusterName: snapshot.getIn(['data', prefix + '.clusterName']),
            clusterId: snapshot.getIn(['data', prefix + '.clusterId']),
            sparkVersion: snapshot.getIn(['data', prefix + '.sparkVersion']),
            clusterCore: snapshot.getIn(['data', prefix + '.clusterCore']),
            clusterSource: snapshot.getIn(['data', prefix + '.clusterSource']),
            configuredLogAnalytics: configuredLogAnalytics,
            timeConfig,
            snapshotId
          };
        }
      }
      return null;
    })
    .filter(Boolean)
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }
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

  if (row.configuredLogAnalytics != 'OK') {
    return (
      <>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['clusters.' + row.clusterName + '.executorCount'],
              labels: [t('in-forge:plugins.azureDatabricks.labelExecutorCount')],
              type: 'line',
              formatter: number.compact
            }}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['clusters.' + row.clusterName + '.jobCount'],
              labels: [t('in-forge:plugins.azureDatabricks.labelJobCount')],
              type: 'line',
              formatter: number.compact
            }}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['clusters.' + row.clusterName + '.clusterMemoryMb'],
              labels: [t('in-forge:plugins.azureDatabricks.labelClusterMemory')],
              type: 'line',
              formatter: megaBytes.compact
            }}
          />
        </Columize>
      </>
    );
  }

  return (
    <>
      <Columize>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['clusters.' + row.clusterName + '.executorCount'],
            labels: [t('in-forge:plugins.azureDatabricks.labelExecutorCount')],
            type: 'line',
            formatter: number.compact
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['clusters.' + row.clusterName + '.jobCount'],
            labels: [t('in-forge:plugins.azureDatabricks.labelJobCount')],
            type: 'line',
            formatter: number.compact
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['clusters.' + row.clusterName + '.clusterMemoryMb'],
            labels: [t('in-forge:plugins.azureDatabricks.labelClusterMemory')],
            type: 'line',
            formatter: megaBytes.compact
          }}
        />
      </Columize>
      <Columize>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['clusters.' + row.clusterName + '.maxShuffleBytesWritten'],
            labels: [t('in-forge:plugins.azureDatabricks.labelMaxShuffleBytesWritten')],
            type: 'line',
            formatter: number.compact
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['clusters.' + row.clusterName + '.sumShuffleClientUsedHeapMemory'],
            labels: [t('in-forge:plugins.azureDatabricks.labelSumShuffleClientUsedHeapMemory')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </Columize>
      <Columize>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['clusters.' + row.clusterName + '.executionDuration'],
            labels: [t('in-forge:plugins.azureDatabricks.labelExecutionDuration')],
            type: 'line',
            formatter: number.compact
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['clusters.' + row.clusterName + '.inputRowsPerSecond'],
            labels: [t('in-forge:plugins.azureDatabricks.labelInputRowPerSecond')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </Columize>
    </>
  );
}
