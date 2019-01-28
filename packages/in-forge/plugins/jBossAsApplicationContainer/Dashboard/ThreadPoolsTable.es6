import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Pool Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Current thread count',
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
    title: 'Current busy threads',
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
    title: 'Min spare threads',
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
    title: 'Max spare threads',
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
  const threadPools = snapshot.getIn(['data', 'threadPools'], emptyMap);
  if (threadPools.size === 0) {
    return null;
  }

  const rows = threadPools
    .keySeq()
    .toArray()
    .map(key => {
      const threadPool = threadPools.get(key);
      return {
        key,
        timeConfig,
        snapshotId: snapshot.get('id'),
        threadPool: threadPool
      };
    });

  return (
    <DashboardSection title={`Thread Pools (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
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
          labels: ['Current threads', 'Current busy', 'Min spare', 'Max spare'],
          type: 'line'
        }}
      />
    </div>
  );
}
