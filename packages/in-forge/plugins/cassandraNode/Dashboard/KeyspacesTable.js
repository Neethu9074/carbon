/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number, micros } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.cassandraNode.dashboard.titleKeyspace'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.cassandraNode.dashboard.titleReads'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `keyspace.${row.key}.reads`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-forge:plugins.cassandraNode.dashboard.titleAvgReadLatency'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `keyspace.${row.key}.readLatency`;
      },
      getContent: micros.fixedCompact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cassandraNode.dashboard.titleWrites'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `keyspace.${row.key}.writes`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-forge:plugins.cassandraNode.dashboard.titleAvgWriteLatency'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `keyspace.${row.key}.writeLatency`;
      },
      getContent: micros.fixedCompact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cassandraNode.dashboard.titleSSTables'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `keyspace.${row.key}.ssTables`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cassandraNode.dashboard.titleDiskSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `keyspace.${row.key}.diskSize`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function KeyspacesTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'keyspaces'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        timeConfig,
        snapshotId
      };
    });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.cassandraNode.dashboard.titleKeyspacesCount', { keyspacesCount: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: micros.detailed,
        metrics: ['keyspace.' + row.key + '.readLatency', 'keyspace.' + row.key + '.writeLatency'],
        labels: [
          t('in-forge:plugins.cassandraNode.dashboard.labelAverageReadLatency'),
          t('in-forge:plugins.cassandraNode.dashboard.labelAverageWriteLatency')
        ],
        type: 'line'
      }}
      y2={{
        min: 0,
        formatter: number.detailed,
        metrics: ['keyspace.' + row.key + '.reads', 'keyspace.' + row.key + '.writes'],
        labels: [
          t('in-forge:plugins.cassandraNode.dashboard.labelReads'),
          t('in-forge:plugins.cassandraNode.dashboard.labelWrites')
        ],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
