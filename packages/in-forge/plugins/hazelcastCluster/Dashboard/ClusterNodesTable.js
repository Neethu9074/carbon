/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest } from '@instana/observables';
import React from 'react';

import { getClusterMembers } from 'in-stores/clusterMembers';
import { yesOrNo } from 'in-services/formatters/boolean';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
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
    title: 'Version',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'version']);
      }
    }
  },
  {
    title: 'Is Lite Member',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.snapshot.getIn(['data', 'isLiteMember']));
      }
    }
  },
  {
    title: 'Is Member Safe',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.snapshot.getIn(['data', 'isLocalMemberSafe']));
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

    return <Table withoutPadding cardTitle="Cluster Nodes" cols={cols} rows={rows} initialSortColumn={1} />;
  }
);
