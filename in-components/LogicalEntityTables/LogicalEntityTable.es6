import React from 'react';

import { percentageTwoDecimalPlaces, msTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import getHostSnapshotId from 'in-services/subscription/getHostSnapshotId';
import { always, alwaysNull } from 'in-services/fixedStreams';
import { getClusterMembers } from 'in-stores/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Health',
    type: 'health',
    typeArgs: {
      getSnapshotId(row) {
        return row.node.get('id');
      }
    }
  },
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.node.get('id');
      }
    }
  },
  {
    title: 'Host',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId$
    }
  },
  {
    title: 'Calls',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.node.get('id');
      },
      getMetricName() {
        return `count`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Latency',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.node.get('id');
      },
      getMetricName() {
        return `msTwoDecimalPlaces`;
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Error Rate',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.node.get('id');
      },
      getMetricName() {
        return `error_rate`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      nodes: props.dataStream
    };
  },
  function LogicalEntityTable({ nodes, title, timeframe, getRowDetails }) {
    if (!nodes || nodes.length === 0) {
      return null;
    }

    const rows = nodes.map(node => {
      return {
        key: node.get('id'),
        snapshot: node,
        timeframe,
        node
      };
    });

    return (
      <DashboardSection title={`${title} (${nodes.length})`}>
        <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
      </DashboardSection>
    );
  }
);

function getSnapshotId$(row) {
  return getHostSnapshotId(row.snapshot).flatMap(hostSnapshotId => {
    if (hostSnapshotId) {
      return always(hostSnapshotId);
    }

    // maybe we have logic instances for which we need to navigate the cluster members one level deeper
    return getClusterMembers(row.snapshot.get('id'))
      .map(clusterMembers => clusterMembers.first())
      .flatMap(clusterMemberId => {
        if (clusterMemberId) {
          return getSnapshot(clusterMemberId).flatMap(clusterMember => getHostSnapshotId(clusterMember));
        }
        return alwaysNull;
      });
  });
}
