/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getRedisEnterpriseNodesForCluster from 'in-subscription/redisEnterpriseCluster/getRedisEnterpriseNodesForCluster';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.uid'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.uid;
      }
    }
  },
  {
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.version'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.getIn(['data', 'version']);
      }
    }
  },
  {
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.shardCount'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.node.getIn(['data', 'shardCount']);
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.connectedClients'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'conns';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.redisEnterpriseCluster.dashboard.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.status;
      }
    }
  }
];

export default connectTo(
  props => ({
    clusterNodes: timeConfig$
      .flatMap(timeConfig => getRedisEnterpriseNodesForCluster({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function ClusterNodesTable({ clusterNodes, timeConfig }) {
    if (clusterNodes == null || clusterNodes.length === 0) {
      return null;
    }

    const rows = clusterNodes.map(node => {
      return {
        key: node.get('id'),
        status: node.getIn(['data', 'status']),
        uid: node.getIn(['data', 'uid']),
        node,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.redisEnterpriseCluster.dashboard.nodesWithCount', {
          count: rows.length
        })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
