import React from 'react';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import MetricValue from 'in-components/MetricValue';
import Table from 'in-sdk/components/dashboard/Table';
import Columize from 'in-sdk/components/dashboard/Columize';
import Chart from 'in-components/Chart';
import { getClusterMembers } from 'in-stores/clusterMembers';
import { combineLatest } from 'reactive-observables';

import { getSnapshot } from 'in-stores/snapshot';

import { emptyList } from 'in-services/fixedImmutables';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

const nodeCols = [
  {
    title: 'Node',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Allocatable CPU',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nodes.data.${row.uid}.alloc_cpu`;
      },
      getContent: twoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Labels',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.labels.join(',');
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      nodes: getClusterMembers(props.snapshot.get('id'))
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id).startWith(null))))
        .map(x => x.filter(y => y != null))
        .throttle(1000)
        .startWith([])
    };
  },
  function KubernetesClusterDashboard({ snapshot, timeframe, nodes }) {
    const snapshotId = snapshot.get('id');
    const nodeCount = snapshot.getIn('data', 'nodes.itemIds', emptyList).length;
    const nodesRows = nodes.filter(node => node.get('plugin') == 'kubernetesNode').map(node => {
      const data = node.get('data');
      return {
        key: data.get('uid'),
        name: data.get('name'),
        namespace: data.get('namespace'),
        labels: data
          .get('labels')
          .map((v, k) => k + '=' + v)
          .toArray(),
        snapshotId: node.get('id')
      };
    });

    return (
      <div>
        <KpiSection>
          <KpiHeading>{getLabel(snapshot)}</KpiHeading>
          <KpiKeyValue label="Node Count">
            <MetricValue snapshotId={snapshotId} initialValue={nodeCount + ''} formatter={zeroDecimalPlaces} />
          </KpiKeyValue>
        </KpiSection>

        <Columize>
          <DashboardSection title="CPU Capacity">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80
              }}
              y1={{
                formatter: twoDecimalPlaces,
                metrics: ['nodes.allocatable_cpu', 'nodes.capacity_cpu'],
                labels: ['Allocatable', 'Capacity'],
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title="Memory Capacity">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80
              }}
              y1={{
                formatter: bytesTwoDecimalPlaces,
                metrics: ['nodes.allocatable_mem', 'nodes.capacity_mem'],
                labels: ['Allocatable', 'Capacity'],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title="Pod Count">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80
              }}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: ['pods.count'],
                labels: ['Pods'],
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title="Pod Capacity">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80
              }}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: ['nodes.allocatable_pods', 'nodes.capacity_pods'],
                labels: ['Allocatable', 'Capacity'],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <DashboardSection title="Available vs Desired Replicas">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['availableReplicas', 'desiredReplicas'],
              labels: ['Availabe', 'Desired'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Nodes">
          <Table cols={nodeCols} rows={nodesRows} initialSortColumn={0} getRowDetails={getNodeRowDetails} />
        </DashboardSection>
      </div>
    );
  }
);

function getNodeRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 60
      }}
      y1={{
        formatter: twoDecimalPlaces,
        metrics: ['alloc_cpu', 'cap_cpu'],
        labels: ['Allocatable CPU', 'Capacity CPU'],
        type: 'line'
      }}
    />
  );
}
