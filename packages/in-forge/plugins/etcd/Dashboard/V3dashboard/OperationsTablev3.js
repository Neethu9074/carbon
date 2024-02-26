/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { carbonAlert } from 'in-themes/chartColors';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.etcd.dashboard.operation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key.replace(/_/g, ' ');
      }
    }
  },
  {
    title: t('in-forge:plugins.etcd.dashboard.count'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'health.' + row.key + '_v3';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  }
];

export default function OperationsTablev3({ snapshot, timeConfig }) {
  const ops = [
    'set',
    'get',
    'create',
    'delete',
    'update',
    'compare_and_swap',
    'compare_and_delete',
    'compare_and_update',
    'getRecursive'
  ];

  const rows = ops.map(key => {
    return {
      key,
      timeConfig,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.etcd.dashboard.operationsWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <Chart
      snapshotId={snapshotId}
      timeConfig={timeConfig}
      y1={{
        formatter: zeroDecimalPlaces,
        metrics: ['health.' + row.key + '_v3'],
        labels: [t('in-forge:plugins.etcd.dashboard.count')],
        type: 'stackedBar',
        colors: [carbonAlert.green50],
        aggregation: 'sum'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
