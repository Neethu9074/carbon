/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest } from '@instana/observables';
import React from 'react';

import { zeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { getClusterMembers } from 'in-stores/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const electedMaster = 'elected Master';

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
    title: 'Master Status',
    type: 'string',
    typeArgs: {
      getValue(row) {
        if (row.snapshot.getIn(['data', 'node.master']) === 'true') {
          return electedMaster;
        } else if (row.snapshot.getIn(['data', 'node.master_eligible']) === 'true') {
          return 'Master-eligible';
        }
        return 'not Master-eligible';
      },
      getContent(value) {
        if (value === electedMaster) {
          return <strong>{electedMaster}</strong>;
        }
        return value;
      }
    }
  },
  {
    title: 'Version',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'version']);
      }
    }
  },
  {
    title: 'Type',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'node.type']);
      }
    }
  },
  {
    title: 'Indices',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'indices_count';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Active Shards',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'shards.node_active_shards';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Documents',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'indices.document_count';
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
        return row.snapshotId;
      },
      getMetricName() {
        return 'indices.store_size';
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Health',
    type: 'health',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      clusterNodes: getClusterMembers(props.clusterSnapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id))))
        .throttle(1000)
    };
  },
  function ClusterNodesTable({ clusterNodes, timeConfig }) {
    if (clusterNodes == null || clusterNodes.length === 0) {
      return null;
    }

    const rows = clusterNodes.map(clusterNode => {
      const id = clusterNode.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: clusterNode,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={`Cluster Nodes (${rows.length})`}
        cols={cols}
        rows={rows}
        initialSortColumn={2}
      />
    );
  }
);
