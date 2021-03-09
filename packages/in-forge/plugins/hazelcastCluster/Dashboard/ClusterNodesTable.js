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
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.hazelcastCluster.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      }
    }
  },
  {
    title: t('in-forge:plugins.hazelcastCluster.dashboard.version'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'version']);
      }
    }
  },
  {
    title: t('in-forge:plugins.hazelcastCluster.dashboard.isLiteMember'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.snapshot.getIn(['data', 'isLiteMember']));
      }
    }
  },
  {
    title: t('in-forge:plugins.hazelcastCluster.dashboard.isMemberSafe'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.snapshot.getIn(['data', 'isLocalMemberSafe']));
      }
    }
  },
  {
    title: t('in-forge:plugins.hazelcastCluster.dashboard.health'),
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
        cardTitle={t('in-forge:plugins.hazelcastCluster.dashboard.clusterNodes')}
        cols={cols}
        rows={rows}
        initialSortColumn={1}
      />
    );
  }
);
