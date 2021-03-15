/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';
import React from 'react';

import { bytes, withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import { getClusterMembers } from 'in-stores/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.clickhouseCluster.dashboard.titleName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseCluster.dashboard.titleVersion'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'version']);
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseCluster.dashboard.titleShard'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'shard_num']);
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseCluster.dashboard.titleReplica'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'replica_num']);
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseCluster.dashboard.titleRows'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'rows';
      },
      getContent: withSiPrefixThreeDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseCluster.dashboard.titleDiskUsage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'bytes_on_disk';
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseCluster.dashboard.titleHealth'),
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
        cardTitle={t('in-forge:plugins.clickhouseCluster.dashboard.titleClusterNodesCount', { nodeCount: rows.length })}
        cols={cols}
        rows={rows}
        initialSortColumn={1}
      />
    );
  }
);
