/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { bytesTwoDecimalPlaces, number } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.cassandraCluster.dashboard.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.cassandraCluster.dashboard.titleReplicationFactor'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'keyspacesInfo', row.key, 'replicationFactor']);
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.cassandraCluster.dashboard.titleDiskSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `keyspace.${row.key}.diskSize`;
      },
      getContent: bytesTwoDecimalPlaces,
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
        snapshot,
        snapshotId,
        timeConfig
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.cassandraCluster.dashboard.labelAvailableNodes', { keyspaceDetails: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        metrics: ['keyspace.' + row.key + '.diskSize'],
        labels: [t('in-forge:plugins.cassandraCluster.dashboard.labelDiskSize')],
        formatter: bytesTwoDecimalPlaces,
        tooltipFormatter: bytesTwoDecimalPlaces,
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
