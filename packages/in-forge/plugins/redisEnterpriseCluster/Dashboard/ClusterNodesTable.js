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

const cols = [
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
    title: 'UID',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.uid;
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
    title: 'Shard Count',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.node.getIn(['data', 'shardCount']);
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: 'Connected Clients',
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
    title: 'Status',
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

    return <Table withoutPadding cardTitle={`Nodes (${rows.length})`} cols={cols} rows={rows} />;
  }
);
