import React from 'react';

import { bytesPerSecondTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Partitions',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.partitionCount;
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: 'Bytes In',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `broker.topicData.${row.key}.bytesInPerSec`;
      },
      getContent: bytesPerSecondTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Bytes Out',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `broker.topicData.${row.key}.bytesOutPerSec`;
      },
      getContent: bytesPerSecondTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Bytes Rejected',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `broker.topicData.${row.key}.bytesRejectedPerSec`;
      },
      getContent: bytesPerSecondTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Messages In',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `broker.topicData.${row.key}.messagesInPerSec`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ClusterTopicsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'partitions'], emptyList)
    .map((partitionCount, topic) => {
      return {
        snapshot,
        snapshotId,
        timeConfig,
        key: topic,
        partitionCount
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table withoutPadding cardTitle={`Topics (${rows.length})`} cols={cols} rows={rows} getRowDetails={getDetails} />
  );
}

function getDetails(row) {
  const key = row.key;
  return (
    <div>
      <DashboardSection title="Messages In">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`broker.topicData.${key}.messagesInPerSec`],
            labels: ['Count'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Traffic">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: bytesPerSecondTwoDecimalPlaces,
            tooltipFormatter: bytesPerSecondTwoDecimalPlaces,
            metrics: [
              `broker.topicData.${key}.bytesInPerSec`,
              `broker.topicData.${key}.bytesOutPerSec`,
              `broker.topicData.${key}.bytesRejectedPerSec`
            ],
            labels: ['In', 'Out', 'Rejected'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
