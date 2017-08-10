import { combineLatest } from 'reactive-observables';
import React from 'react';

import { zeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
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
        return row.key;
      }
    }
  },
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
    title: 'Version',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.getIn(['data', 'version']);
      }
    }
  },
  {
    title: 'Nr. of Keyspaces',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'keyspaceCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Store Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'overallDiskSize';
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'State',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.getIn(['data', 'mode']);
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      clusterNodes: getClusterMembers(props.snapshot.get('id'))
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id))))
        .throttle(1000)
    };
  },
  function ClusterNodesTable({ clusterNodes, timeframe }) {
    if (clusterNodes == null || clusterNodes.length === 0) {
      return null;
    }

    const rows = clusterNodes.map(node => {
      return {
        key: node.get('id'),
        node,
        timeframe
      };
    });

    return (
      <DashboardSection title={`Live Nodes (${rows.length})`}>
        <Table cols={cols} rows={rows} />
      </DashboardSection>
    );
  }
);
