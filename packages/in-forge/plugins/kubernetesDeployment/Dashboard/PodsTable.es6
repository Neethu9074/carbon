import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getClusterMembers } from 'in-stores/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      }
    }
  },
  {
    title: 'Namespace',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.namespace;
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      pods: getClusterMembers(props.snapshot.get('id')).flatMap(podIds => getSnapshots(podIds.toArray()))
    };
  },
  function PodsTable({ pods = [], timeframe }) {
    const rows = pods.map(pod => {
      // const rows = pods.map(pod => {
      const data = pod.get('data');
      return {
        key: data.get('name'),
        snapshotId: pod.get('id'),
        namespace: data.get('namespace'),
        timeframe
      };
    });

    return (
      <DashboardSection title={`Pods (${rows.length})`}>
        <Table cols={cols} rows={rows} />
      </DashboardSection>
    );
  }
);
