/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudElasticsearch.memberID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudElasticsearch.status'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.cluster_status`;
      },
      getContent(value) {
        return getStatusText(value);
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudElasticsearch.unassignedShards'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.unassigned_shards_total`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function StatusTable({ snapshot, timeConfig, memberIds }) {
  if (!memberIds || memberIds.isEmpty()) {
    return null;
  }

  const rows = memberIds.toArray().map(member => {
    return {
      key: member,
      name: member,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmCloudElasticsearch.titleCluster')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      maxItemsPerPage={10}
    />
  );
}

function getDetails(row) {
  return (
    <Columize>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: statusFormatter,
          metrics: ['members.' + row.name + '.cluster_status'],
          labels: [t('in-forge:plugins.ibmCloudElasticsearch.status')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: number.compact,
          metrics: ['members.' + row.name + '.unassigned_shards_total'],
          labels: [t('in-forge:plugins.ibmCloudElasticsearch.unassignedShards')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </Columize>
  );
}

function getStatusText(value) {
  switch (value) {
    case 0:
      return t('in-forge:plugins.ibmCloudElasticsearch.yellow');
    case 1:
      return t('in-forge:plugins.ibmCloudElasticsearch.green');
    case -1:
    default:
      return t('in-forge:plugins.ibmCloudElasticsearch.red');
  }
}

function statusFormatter(value) {
  return value + ': ' + getStatusText(value);
}
