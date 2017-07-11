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
    title: 'OOB Messages Threads Size',
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
    title: 'OOB Messages Active Threads Size',
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
    title: 'OOB Messages Queue Size',
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
    <DashboardSection title="JGroups OOB Thread Pool Statistics">
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
            'clustersUDPStatistics.' + row.key + '.oobThreadsSize',
            'clustersUDPStatistics.' + row.key + '.oobActiveThreadsSize',
            'clustersUDPStatistics.' + row.key + '.oobQueueSize'
          ],
          labels: ['OOB Messages Threads Size', 'OOB Messages Active Threads Size', 'OOB Messages Queue Size'],
          type: 'line'
        }}
      />
    </div>
  );
}
