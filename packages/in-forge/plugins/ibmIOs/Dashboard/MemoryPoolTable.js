/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from '../../../PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.memoryPoolName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.storageUsed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `memoryPoolMetrics.${row.key}.currSize`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.storageReserved'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `memoryPoolMetrics.${row.key}.resSize`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.storageDefined'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `memoryPoolMetrics.${row.key}.defSize`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.activeThreads'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `memoryPoolMetrics.${row.key}.currThreads`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.ineligibleThreads'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `memoryPoolMetrics.${row.key}.currIneligibleThreads`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.maxActiveThreads'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `memoryPoolMetrics.${row.key}.maxActiveThreads`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function MemoryPoolsTable({ snapshot, timeConfig }) {
  const memoryPools = snapshot.getIn(['data', 'memoryPools'], emptyMap);
  if (memoryPools.size === 0) {
    return null;
  }

  const rows = memoryPools.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.name')}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: bytes.detailed,
          metrics: [
            'memoryPoolMetrics.' + row.key + '.currSize',
            'memoryPoolMetrics.' + row.key + '.resSize',
            'memoryPoolMetrics.' + row.key + '.defSize'
          ],
          labels: [
            t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.storage.storageUsed'),
            t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.storage.storageReserved'),
            t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.storage.storageDefined')
          ],
          min: 0,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: number.compact,
          metrics: [
            'memoryPoolMetrics.' + row.key + '.currThreads',
            'memoryPoolMetrics.' + row.key + '.currIneligibleThreads',
            'memoryPoolMetrics.' + row.key + '.maxActiveThreads'
          ],
          labels: [
            t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.threads.activeThreads'),
            t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.threads.ineligibleThreads'),
            t('in-forge:plugins.ibmIOs.dashboard.tables.memoryPools.charts.threads.maxActiveThreads')
          ],
          min: 0,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
