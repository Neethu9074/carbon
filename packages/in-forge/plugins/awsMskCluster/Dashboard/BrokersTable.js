/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
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
    title: 'Leaders',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'leader_count';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Partitions',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'partition_count';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Under-replicated',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'under_replicated_partitions';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Messages In',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'messages_in_per_sec';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Bytes In',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'bytes_in_ser_sec';
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Bytes Out',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'bytes_out_per_sec';
      },
      getContent: bytes.compact,
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
        return row.key;
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      clusterBrokers: getClusterMembers(props.clusterSnapshotId)
        .flatMap(brokerIds => combineLatest(brokerIds.toArray().map(id => getSnapshot(id))))
        .throttle(1000)
    };
  },
  function ClusterBrokersTable({ clusterBrokers, timeConfig }) {
    if (clusterBrokers == null || clusterBrokers.length === 0) {
      return null;
    }

    const rows = clusterBrokers.map(broker => {
      return {
        key: broker.get('id'),
        broker,
        timeConfig
      };
    });

    return <Table withoutPadding cardTitle={`Cluster Brokers (${rows.length})`} cols={cols} rows={rows} />;
  }
);
