import React from 'react';

import createNamespacesForClusterSubscription from 'in-subscription/namespacesForCluster';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { twoDecimalPlaces, bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Status',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.status;
      }
    }
  },
  {
    title: 'CPU Requests Allocation',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `required_cpu_percentage`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'CPU Limits Allocation',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `limit_cpu_percentage`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Memory Requests Allocation',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `required_mem_percentage`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Memory Limits Allocation',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `limit_mem_percentage`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Pods Allocation',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `used_pods_percentage`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => ({
    namespaceSnapshots: timeConfig$
      .flatMap(timeConfig =>
        createNamespacesForClusterSubscription({ snapshotId: props.snapshot.get('id'), timeConfig })
      )
      .flatMap(getSnapshots)
  }),

  function NamespacesTable({ namespaceSnapshots }) {
    let rows = [];

    if (namespaceSnapshots) {
      rows = namespaceSnapshots.map(namespaceSnapshot => ({
        key: namespaceSnapshot.get('id'),
        snapshotId: namespaceSnapshot.get('id'),
        name: namespaceSnapshot.getIn(['data', 'name']),
        status: namespaceSnapshot.getIn(['data', 'status'])
      }));
    }

    return (
      <DashboardSection title={`Namespaces (${rows.length})`}>
        <Table cols={cols} rows={rows} getRowDetails={getNamespaceRowDetails} />
      </DashboardSection>
    );
  }
);

function getNamespaceRowDetails(row) {
  return (
    <div>
      <Columize>
        <DashboardSection title={`CPU Requests / Limits`}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              formatter: twoDecimalPlaces,
              metrics: [`cap_requests_cpu`, `used_requests_cpu`, `cap_limits_cpu`, `used_limits_cpu`],
              labels: ['Capacity Requests', 'Used Requests', 'Capacity Limits', 'Used Limits'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Memory Requests / Limits`}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: [`cap_requests_memory`, `used_requests_memory`, `cap_limits_memory`, `used_limits_memory`],
              labels: ['Capacity Requests', 'Used Requests', 'Capacity Limits ', 'Used Limits'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
