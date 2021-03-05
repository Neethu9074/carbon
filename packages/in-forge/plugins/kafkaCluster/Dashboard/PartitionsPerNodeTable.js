/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest } from '@instana/observables';
import { t } from 'in-i18n';
import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { getClusterMembers } from 'in-stores/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: t('in-forge:plugins.kafkaCluster.node'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.partitions'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'broker.partitionCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.leaders'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'broker.leaderCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.offlinePartitions'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'broker.offlinePartitionsCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.underReplicatedPartitions'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'broker.underReplicatedPartitions';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      clusterNodes: getClusterMembers(props.clusterSnapshotId)
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id))))
        .throttle(1000)
    };
  },
  function PartitionsPerNodeTable({ clusterNodes, timeConfig }) {
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
      <Table withoutPadding cardTitle={t('in-forge:plugins.kafkaCluster.partitionsPerNode')} cols={cols} rows={rows} />
    );
  }
);
