/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudIsLoadBalancer.applianceId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return isAggregateRow(row) ? t('in-forge:plugins.ibmCloudIsLoadBalancer.aggregate') : row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudIsLoadBalancer.http_2xx'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return isAggregateRow(row) ? 'backend_http_2xx' : `appliances.${row.name}.backend_http_2xx`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudIsLoadBalancer.http_3xx'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return isAggregateRow(row) ? 'backend_http_3xx' : `appliances.${row.name}.backend_http_3xx`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudIsLoadBalancer.http_4xx'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return isAggregateRow(row) ? 'backend_http_4xx' : `appliances.${row.name}.backend_http_4xx`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudIsLoadBalancer.http_5xx'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return isAggregateRow(row) ? 'backend_http_5xx' : `appliances.${row.name}.backend_http_5xx`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function HttpStatusTable({ snapshot, timeConfig, applianceIds }) {
  if (!applianceIds || applianceIds.isEmpty()) {
    return null;
  }

  const rows = applianceIds.toArray().map(appliance => {
    return {
      key: appliance,
      name: appliance,
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
      cardTitle={t('in-forge:plugins.ibmCloudIsLoadBalancer.httpStatus')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      maxItemsPerPage={10}
    />
  );
}

function getDetails(row) {
  let http2xxMetric = 'appliances.' + row.name + '.backend_http_2xx',
    http3xxMetric = 'appliances.' + row.name + '.backend_http_3xx',
    http4xxMetric = 'appliances.' + row.name + '.backend_http_4xx',
    http5xxMetric = 'appliances.' + row.name + '.backend_http_5xx';

  if (isAggregateRow(row)) {
    http2xxMetric = 'backend_http_2xx';
    http3xxMetric = 'backend_http_3xx';
    http4xxMetric = 'backend_http_4xx';
    http5xxMetric = 'backend_http_5xx';
  }

  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: [http2xxMetric, http3xxMetric, http4xxMetric, http5xxMetric],
        labels: [
          t('in-forge:plugins.ibmCloudIsLoadBalancer.http_2xx'),
          t('in-forge:plugins.ibmCloudIsLoadBalancer.http_3xx'),
          t('in-forge:plugins.ibmCloudIsLoadBalancer.http_4xx'),
          t('in-forge:plugins.ibmCloudIsLoadBalancer.http_5xx')
        ],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function isAggregateRow(row) {
  return row.name === '_total_';
}
