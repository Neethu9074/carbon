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
    title: 'Incoming Messages Threads Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `clustersUDPStatistics.${row.key}.defaultThreadsSize`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Incoming Messages Active Threads Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `clustersUDPStatistics.${row.key}.defaultActiveThreadsSize`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Incoming Messages Queue Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `clustersUDPStatistics.${row.key}.defaultQueueSize`;
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
    <DashboardSection title="JGroups Default Thread Pool Statistics">
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
            'clustersUDPStatistics.' + row.key + '.defaultThreadsSize',
            'clustersUDPStatistics.' + row.key + '.defaultActiveThreadsSize',
            'clustersUDPStatistics.' + row.key + '.defaultQueueSize'
          ],
          labels: [
            'Incoming Messages Threads Size',
            'Incoming Messages Active Threads Size',
            'Incoming Messages Queue Size'
          ],
          type: 'line'
        }}
      />
    </div>
  );
}
