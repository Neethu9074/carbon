import React from 'react';

import { number } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart'
import { emptyMap } from 'in-services/fixedImmutables';

const cols = [
  {
    title: 'Cluster name',
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
    title: 'Timer Threads Size',
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
    title: 'Timer Queue Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `clustersUDPStatistics.${row.key}.timerQueueSize`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Timer Tasks Size',
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

export default function ClusterUDPStatisticsTable({ snapshot, timeframe }) {
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
      timeframe,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <DashboardSection title="JGroups Timer Thread Pool Statistics">
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: number.compact,
          metrics: [
            'clustersUDPStatistics.' + row.key + '.timerThreadsSize',
            'clustersUDPStatistics.' + row.key + '.timerQueueSize',
            'clustersUDPStatistics.' + row.key + '.timerTasks'
          ],
          labels: ['Timer Threads Size', 'Timer Queue Size', 'Timer Tasks Size'],
          type: 'line'
        }}
      />
    </div>
  );
}
