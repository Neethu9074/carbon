/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { combineLatest } from '@instana/observables';
import React from 'react';

import { zeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { getClusterMembers } from 'in-stores/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: t('in-forge:plugins.cassandraCluster.dashboard.titleName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.cassandraCluster.dashboard.titleVersion'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.getIn(['data', 'version']);
      }
    }
  },
  {
    title: t('in-forge:plugins.cassandraCluster.dashboard.titleKeyspaces'),
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
    title: t('in-forge:plugins.cassandraCluster.dashboard.titleStoreSize'),
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
    title: t('in-forge:plugins.cassandraCluster.dashboard.titleState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.getIn(['data', 'mode']);
      }
    }
  },
  {
    title: t('in-forge:plugins.cassandraCluster.dashboard.titleHealth'),
    type: 'health',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
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
  function ClusterNodesTable({ clusterNodes, timeConfig }) {
    if (clusterNodes == null || clusterNodes.length === 0) {
      return null;
    }

    const rows = clusterNodes.map(node => {
      return {
        key: node.get('id'),
        node,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.cassandraCluster.dashboard.titleAvailableNodesCount', {
          nodeCount: rows.length
        })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
