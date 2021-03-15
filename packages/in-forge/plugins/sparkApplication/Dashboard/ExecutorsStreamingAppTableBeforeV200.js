/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  zeroDecimalPlaces,
  bytes,
  zeroDecimalPlacesPerSecond,
  bytesPerSecondZeroDecimalPlaces,
  bytesPerSecondTwoDecimalPlaces
} from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.id'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.rddBlocks'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.rddBlocks';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.storageMemory'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.memoryUsed';
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.diskUsed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.diskUsed';
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.failedTasksPerSecond'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.failedTasksDelta';
      },
      getContent: zeroDecimalPlacesPerSecond,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.completedTasksPerSecond'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.completedTasksDelta';
      },
      getContent: zeroDecimalPlacesPerSecond,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.inputBytesPerSecond'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.inputBytesDelta';
      },
      getContent: bytesPerSecondTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.shuffleReadPerSecond'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.shuffleReadDelta';
      },
      getContent: bytesPerSecondTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.shuffleWritePerSecond'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'executors.' + row.key + '.shuffleWriteDelta';
      },
      getContent: bytesPerSecondTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ExecutorsTable({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const executorIds = data.get('executors.idList', emptyList);
  if (executorIds.size === 0) {
    return null;
  }

  const rows = executorIds.toArray().map(key => {
    return {
      key,
      data: data,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sparkApplication.dashboard.executorsWithCount', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlacesPerSecond,
          metrics: ['executors.' + row.key + '.completedTasksDelta', 'executors.' + row.key + '.failedTasksDelta'],
          labels: [
            t('in-forge:plugins.sparkApplication.dashboard.completedTasksPerSecond'),
            t('in-forge:plugins.sparkApplication.dashboard.failedTasksPerSecond')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['executors.' + row.key + '.rddBlocks'],
          labels: [t('in-forge:plugins.sparkApplication.dashboard.rddBlocks')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytes.compact,
          tooltipFormatter: bytes.detailed,
          metrics: ['executors.' + row.key + '.memoryUsed', 'executors.' + row.key + '.maxMemory'],
          labels: [
            t('in-forge:plugins.sparkApplication.dashboard.storageMemory'),
            t('in-forge:plugins.sparkApplication.dashboard.maxMemory')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytes.compact,
          tooltipFormatter: bytes.detailed,
          metrics: ['executors.' + row.key + '.diskUsed'],
          labels: [t('in-forge:plugins.sparkApplication.dashboard.diskUsed')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytesPerSecondZeroDecimalPlaces,
          tooltipFormatter: bytesPerSecondTwoDecimalPlaces,
          metrics: ['executors.' + row.key + '.inputBytesDelta'],
          labels: [t('in-forge:plugins.sparkApplication.dashboard.inputBytesPerSecond')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytesPerSecondZeroDecimalPlaces,
          tooltipFormatter: bytesPerSecondTwoDecimalPlaces,
          metrics: ['executors.' + row.key + '.shuffleReadDelta', 'executors.' + row.key + '.shuffleWriteDelta'],
          labels: [
            t('in-forge:plugins.sparkApplication.dashboard.shuffleReadPerSecond'),
            t('in-forge:plugins.sparkApplication.dashboard.shuffleWritePerSecond')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
