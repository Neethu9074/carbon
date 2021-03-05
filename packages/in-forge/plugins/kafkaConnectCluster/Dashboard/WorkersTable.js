/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest } from '@instana/observables';
import { t } from 'in-i18n';
import React from 'react';

import { zeroDecimalPlaces, percentage, number, ms } from 'in-services/formatters/number';
import { getClusterMembers } from 'in-stores/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: t('in-forge:plugins.kafkaConnectCluster.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaConnectCluster.connectorStartupFailure'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'connectorStartupFailurePercentage';
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaConnectCluster.taskStartupFailure'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'taskStartupFailurePercentage';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaConnectCluster.completedRebalances'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'completedRebalancesTotal';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaConnectCluster.rebalanceAverageTime'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'rebalanceAvgTimeMs';
      },
      getContent: ms.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaConnectCluster.rebalancing'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'rebalancing';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaConnectCluster.timeSinceLastRebalance'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'timeSinceLastRebalanceMs';
      },
      getContent: ms.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      workers: getClusterMembers(props.clusterId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id))))
        .throttle(1000)
    };
  },
  function WorkersTable({ workers, timeConfig }) {
    if (workers == null || workers.length === 0) {
      return null;
    }

    const rows = workers.map(worker => {
      const id = worker.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: worker,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.kafkaConnectCluster.workersWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
