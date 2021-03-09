/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
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
    title: t('in-forge:plugins.etcd.dashboard.success'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'storage.' + row.key + '_success';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-forge:plugins.etcd.dashboard.fail'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'storage.' + row.key + '_fail';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  }
];

export default function OperationsTable({ snapshot, timeConfig }) {
  const ops = ['gets', 'sets', 'create', 'delete', 'update', 'compare_and_swap', 'compare_and_delete'];

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
      cardTitle={t('in-forge:plugins.etcd.dashboard.operationsWithCount', { count: rows.length })}
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
        metrics: ['storage.' + row.key + '_success', 'storage.' + row.key + '_fail'],
        labels: [t('in-forge:plugins.etcd.dashboard.success'), t('in-forge:plugins.etcd.dashboard.fail')],
        type: 'stackedBar',
        colors: [theme.lib.colors.green800, theme.lib.colors.red800],
        aggregation: 'sum'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
