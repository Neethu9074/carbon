/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.poolName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.currentThreadCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'threadPools.' + row.key + '.currentThreadCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.currentBusyThreads'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'threadPools.' + row.key + '.currentThreadsBusy';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.minSpareThreads'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'threadPools.' + row.key + '.minSpareThreads';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },

  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.maxSpareThreads'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'threadPools.' + row.key + '.maxSpareThreads';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ThreadPoolsTable({ snapshot, timeConfig }) {
  const threadPoolIds = snapshot.getIn(['data', 'threadPoolIds'], emptyList);
  if (threadPoolIds.size === 0) {
    return null;
  }

  const snapshotId = snapshot.get('id');
  const rows = threadPoolIds.toArray().map(key => {
    return {
      key,
      timeConfig,
      snapshotId
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.jBossAsApplicationContainer.threadPoolsWithCount', { len: rows.length })}
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
          formatter: zeroDecimalPlaces,
          metrics: [
            'threadPools.' + row.key + '.currentThreadCount',
            'threadPools.' + row.key + '.currentThreadsBusy',
            'threadPools.' + row.key + '.minSpareThreads',
            'threadPools.' + row.key + '.maxSpareThreads'
          ],
          labels: [
            t('in-forge:plugins.jBossAsApplicationContainer.currentThreads'),
            t('in-forge:plugins.jBossAsApplicationContainer.currentBusy'),
            t('in-forge:plugins.jBossAsApplicationContainer.minSpare'),
            t('in-forge:plugins.jBossAsApplicationContainer.maxSpare')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
