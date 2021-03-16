/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
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
    title: t('in-forge:plugins.jbossDataGrid.oobMessagesThreadsSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `clustersUDPStatistics.${row.key}.oobThreadsSize`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jbossDataGrid.oobMessagesActiveThreadsSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `clustersUDPStatistics.${row.key}.oobActiveThreadsSize`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jbossDataGrid.oobMessagesQueueSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `clustersUDPStatistics.${row.key}.oobQueueSize`;
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
      cardTitle={t('in-forge:plugins.jbossDataGrid.jGroupsOobThreadPoolStatistics')}
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
            'clustersUDPStatistics.' + row.key + '.oobThreadsSize',
            'clustersUDPStatistics.' + row.key + '.oobActiveThreadsSize',
            'clustersUDPStatistics.' + row.key + '.oobQueueSize'
          ],
          labels: [
            t('in-forge:plugins.jbossDataGrid.oobMessagesThreadsSize'),
            t('in-forge:plugins.jbossDataGrid.oobMessagesActiveThreadsSize'),
            t('in-forge:plugins.jbossDataGrid.oobMessagesQueueSize')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
