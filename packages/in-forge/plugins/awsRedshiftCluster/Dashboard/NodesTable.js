/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { combineLatest } from '@instana/observables';

import { bytes, number, percentagePlainTwoDecimalPlaces, seconds } from 'in-services/formatters/number';
import { getClusterMembers } from 'in-sdk/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.awsRedshiftCluster.dashboard.nodeName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.awsRedshiftCluster.dashboard.cpuUtilization'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'cpu_utilization';
      },
      getContent: percentagePlainTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.awsRedshiftCluster.dashboard.readIOPS'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'read_iops';
      },
      getContent: number.perSecond.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.awsRedshiftCluster.dashboard.writeIOPS'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'write_iops';
      },
      getContent: number.perSecond.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.awsRedshiftCluster.dashboard.readLatency'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'read_latency';
      },
      getContent: seconds.fixedCompact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.awsRedshiftCluster.dashboard.writeLatency'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'write_latency';
      },
      getContent: seconds.fixedCompact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.awsRedshiftCluster.dashboard.readThroughput'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'read_throughput';
      },
      getContent: bytes.perSecond.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.awsRedshiftCluster.dashboard.writeThroughput'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'write_throughput';
      },
      getContent: bytes.perSecond.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.awsRedshiftCluster.dashboard.clusterHealth'),
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
      clusterNodes: getClusterMembers(props.clusterSnapshotId)
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
        cardTitle={t('in-forge:plugins.awsRedshiftCluster.dashboard.clusterNodesRows', { rows: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
