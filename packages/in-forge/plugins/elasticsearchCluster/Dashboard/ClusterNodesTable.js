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
import { t } from 'in-i18n';

const electedMaster = 'elected Master';

const cols = [
  {
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      }
    }
  },
  {
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.masterStatus'),
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
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.version'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'version']);
      }
    }
  },
  {
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'node.type']);
      }
    }
  },
  {
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.indices'),
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
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.activeShards'),
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
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.documents'),
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
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.storeSize'),
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
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.health'),
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
        cardTitle={t('in-forge:plugins.elasticsearchCluster.dashboard.clusterNodesWithCount', { count: rows.length })}
        cols={cols}
        rows={rows}
        initialSortColumn={2}
      />
    );
  }
);
