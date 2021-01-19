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
      cardTitle={`Thread Pools (${rows.length})`}
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
          labels: ['Current threads', 'Current busy', 'Min spare', 'Max spare'],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
