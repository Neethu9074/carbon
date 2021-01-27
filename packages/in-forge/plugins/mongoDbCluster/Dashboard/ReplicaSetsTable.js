/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import { combineLatest } from '@instana/observables';
import React from 'react';

import { number, bytes } from 'in-services/formatters/number';
import { getClusterMembers } from 'in-stores/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
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
    title: 'Connections',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'connections';
      },
      getContent: number,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Ops',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'repl.network_ops';
      },
      getContent: number,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Network Bytes',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'repl.network_bytes';
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      clusterReplicaSets: getClusterMembers(props.clusterSnapshotId)
        .flatMap(replicaSetIds => combineLatest(replicaSetIds.toArray().map(id => getSnapshot(id))))
        .throttle(1000)
    };
  },
  function ReplicaSetsTable({ clusterReplicaSets, timeConfig }) {
    if (clusterReplicaSets == null || clusterReplicaSets.length === 0) {
      return null;
    }

    const rows = clusterReplicaSets.map(replicaSet => {
      return {
        key: replicaSet.get('id'),
        replicaSet,
        timeConfig
      };
    });

    return <Table withoutPadding cardTitle={`Shards/Replica Sets (${rows.length})`} cols={cols} rows={rows} />;
  }
);
