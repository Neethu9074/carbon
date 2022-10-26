/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.webSphereAppContainer.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.labelActiveThreads'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'threadPools.' + row.key + '.activeThreads';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.labelPoolSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'threadPools.' + row.key + '.poolSize';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.labelConcurrentlyHungThreads'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'threadPools.' + row.key + '.concurrentlyHungThreads';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.labelDeclaredThreadHung'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'threadPools.' + row.key + '.declaredThreadHung';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ThreadPoolsTable({ snapshot, timeConfig }) {
  const threadPools = snapshot.getIn(['data', 'threadPoolNames'], emptyList);
  if (threadPools.size === 0) {
    return null;
  }

  const rows = threadPools.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.webSphereAppContainer.titleThreadPoolsCount', {
        len: rows.length
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
          formatter: zeroDecimalPlaces,
          metrics: [
            'threadPools.' + row.key + '.activeThreads',
            'threadPools.' + row.key + '.poolSize',
            'threadPools.' + row.key + '.concurrentlyHungThreads',
            'threadPools.' + row.key + '.declaredThreadHung'
          ],
          labels: [
            t('in-forge:plugins.webSphereAppContainer.labelActiveThreads'),
            t('in-forge:plugins.webSphereAppContainer.labelPoolSize'),
            t('in-forge:plugins.webSphereAppContainer.labelConcurrentlyHungThreads'),
            t('in-forge:plugins.webSphereAppContainer.labelDeclaredThreadHung')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
