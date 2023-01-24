/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { emptyMap } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.jbossDataGrid.clusterName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.jbossDataGrid.timerThreadsSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `clustersUDPStatistics.${row.key}.timerThreadsSize`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jbossDataGrid.timerTasksSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `clustersUDPStatistics.${row.key}.timerTasks`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ClusterUDPStatisticsTable({ snapshot, timeConfig }) {
  const clusters = snapshot
    .getIn(['data', 'clusters'], emptyMap)
    .filter(clusterInfo => clusterInfo.get('udpStats') === true)
    .keySeq()
    .toArray();

  if (clusters.size === 0) {
    return null;
  }

  const rows = clusters.map(cluster => {
    return {
      key: cluster,
      timeConfig,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.jbossDataGrid.jGroupsTimerThreadPoolStatistics')}
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
          formatter: number.compact,
          metrics: [
            'clustersUDPStatistics.' + row.key + '.timerThreadsSize',
            'clustersUDPStatistics.' + row.key + '.timerTasks'
          ],
          labels: [
            t('in-forge:plugins.jbossDataGrid.timerThreadsSize'),
            t('in-forge:plugins.jbossDataGrid.timerTasksSize')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
