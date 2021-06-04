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
    title: t('in-forge:plugins.ibmCloudMongoDb.memberID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudMongoDb.replicaLag'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.replica_lag`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudMongoDb.status'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.status`;
      },
      getContent(value) {
        return getStatusText(value);
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ReplicaTable({ snapshot, timeConfig, memberIds }) {
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
      cardTitle={t('in-forge:plugins.ibmCloudMongoDb.replica')}
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
          formatter: number.compact,
          metrics: ['members.' + row.name + '.replica_lag'],
          labels: [t('in-forge:plugins.ibmCloudMongoDb.replicaLag')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: statusFormatter,
          metrics: ['members.' + row.name + '.status'],
          labels: [t('in-forge:plugins.ibmCloudMongoDb.status')],
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
      return t('in-forge:plugins.ibmCloudMongoDb.startup');
    case 1:
      return t('in-forge:plugins.ibmCloudMongoDb.primary');
    case 2:
      return t('in-forge:plugins.ibmCloudMongoDb.secondary');
    case 3:
      return t('in-forge:plugins.ibmCloudMongoDb.recovery');
    case 4:
      return t('in-forge:plugins.ibmCloudMongoDb.startup2');
    case 7:
      return t('in-forge:plugins.ibmCloudMongoDb.arbiter');
    case 8:
      return t('in-forge:plugins.ibmCloudMongoDb.down');
    case 9:
      return t('in-forge:plugins.ibmCloudMongoDb.rollback');
    case 6:
    default:
      return t('in-forge:plugins.ibmCloudMongoDb.unknown');
  }
}

function statusFormatter(value) {
  return value + ': ' + getStatusText(value);
}
