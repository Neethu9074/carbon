/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { megaBytes, number, bytes, seconds } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeConfig } from 'in-types';
import { List } from 'immutable';
import { t } from 'in-i18n';

interface ClusterRow {
  key: string;
  snapshot: SnapshotData;
  configuredLogAnalytics: string;
  timeConfig: TimeConfig;
  snapshotId: string;
}

const cols = [
  {
    title: t('in-forge:plugins.azureDatabricks.labelClusterName'),
    type: 'string',
    typeArgs: {
      getValue({ key }: ClusterRow) {
        return key;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelClusterId'),
    type: 'string',
    typeArgs: {
      getValue({ snapshot, key }: ClusterRow) {
        return snapshot.getIn(['data', `clusters.${key}.clusterId`]);
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelSparkVersion'),
    type: 'string',
    typeArgs: {
      getValue({ snapshot, key }: ClusterRow) {
        return snapshot.getIn(['data', `clusters.${key}.sparkVersion`]);
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelClusterCore'),
    type: 'string',
    typeArgs: {
      getValue({ snapshot, key }: ClusterRow) {
        return snapshot.getIn(['data', `clusters.${key}.clusterCore`]);
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelClusterSource'),
    type: 'string',
    typeArgs: {
      getValue({ snapshot, key }: ClusterRow) {
        return snapshot.getIn(['data', `clusters.${key}.clusterSource`]);
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelExecutorCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: ClusterRow) {
        return snapshotId;
      },
      getMetricName({ key }: ClusterRow) {
        return `clusters.${key}.executorCount`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelClusterMemory'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: ClusterRow) {
        return snapshotId;
      },
      getMetricName({ key }: ClusterRow) {
        return `clusters.${key}.clusterMemoryMb`;
      },
      getContent: megaBytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelJobCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: ClusterRow) {
        return snapshotId;
      },
      getMetricName({ key }: ClusterRow) {
        return `clusters.${key}.jobCount`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

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

  const rows: ClusterRow[] = clusterNames.toArray().map((clusterName: string) => {
    return {
      key: clusterName,
      snapshot: snapshot,
      configuredLogAnalytics: configuredLogAnalytics,
      timeConfig,
      snapshotId
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureDatabricks.titleClustersCount', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row: ClusterRow) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <>
      <Columize>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [`clusters.${row.key}.executorCount`],
            labels: [t('in-forge:plugins.azureDatabricks.labelExecutorCount')],
            type: 'line',
            formatter: number.compact
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [`clusters.${row.key}.jobCount`],
            labels: [t('in-forge:plugins.azureDatabricks.labelJobCount')],
            type: 'line',
            formatter: number.compact
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [`clusters.${row.key}.clusterMemoryMb`],
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
                metrics: [`clusters.${row.key}.maxShuffleBytesWritten`],
                labels: [t('in-forge:plugins.azureDatabricks.labelMaxShuffleBytesWritten')],
                type: 'line',
                formatter: bytes.compact
              }}
            />
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: [`clusters.${row.key}.sumShuffleClientUsedHeapMemory`],
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
                metrics: [`clusters.${row.key}.executionDuration`],
                labels: [t('in-forge:plugins.azureDatabricks.labelExecutionDuration')],
                type: 'line',
                formatter: seconds.fixedCompact
              }}
            />
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: [`clusters.${row.key}.inputRowsPerSecond`],
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
