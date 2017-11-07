import React from 'react';

import { twoDecimalPlaces, bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getClusterMembers } from 'in-stores/clusterMembers';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Node',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotLinkId;
      }
    }
  },
  {
    title: 'CPU Shares Allocated',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nodes.data.${row.key}.percent_cpu_allocated`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Memory Allocated',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nodes.data.${row.key}.percent_mem_allocated`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Pods Allocated',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nodes.data.${row.key}.percent_pods_allocated`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Internal IP',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.internalIp;
      }
    }
  },
  {
    title: 'Labels',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return (row.labels || []).join(', ');
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      clusterNodes: getClusterMembers(props.snapshot.get('id')).flatMap(nodeIds => getSnapshots(nodeIds.toArray()))
    };
  },
  function NodesTable({ snapshot, clusterNodes = [], timeframe }) {
    const rows = clusterNodes.filter(node => node.get('plugin') == 'kubernetesNode').map(node => {
      const data = node.get('data');
      return {
        key: data.get('uid'),
        snapshotId: snapshot.get('id'),
        snapshotLinkId: node.get('id'),
        internalIp: data.get('internalIp'),
        labels: data.get('labels', emptyList).map((v, k) => k + '=' + v),
        timeframe
      };
    });

    return (
      <DashboardSection title={`Nodes (${rows.length})`}>
        <Table cols={cols} rows={rows} getRowDetails={getNodeRowDetails} />
      </DashboardSection>
    );
  }
);

function getNodeRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 60
        }}
        y1={{
          formatter: twoDecimalPlaces,
          metrics: [`nodes.data.${row.key}.alloc_cpu`, `nodes.data.${row.key}.cap_cpu`],
          labels: ['CPU Allocatable', 'CPU Limit'],
          type: 'line'
        }}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 60
        }}
        y1={{
          formatter: bytesTwoDecimalPlaces,
          metrics: [`nodes.data.${row.key}.alloc_mem`, `nodes.data.${row.key}.cap_mem`],
          labels: ['Memory Allocatable', 'Memory Limit'],
          type: 'line'
        }}
      />
    </div>
  );
}
