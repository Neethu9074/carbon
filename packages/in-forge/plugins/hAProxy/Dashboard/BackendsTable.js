/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { msTwoDecimalPlaces, number, millis } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.hAProxy.dashboard.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.averageResponseTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `backendStats.${row.key}.avgResponseTime`;
      },
      getContent: millis.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.averageQueueTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `backendStats.${row.key}.avgQueueTime`;
      },
      getContent: millis.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.queueSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `backendStats.${row.key}.queueSize`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.connectionErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `backendStats.${row.key}.reqConnErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.responseErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `backendStats.${row.key}.errorRes`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.connectionRetries'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `backendStats.${row.key}.connRetries`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.deniedResponses'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `backendStats.${row.key}.deniedRes`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.reDispatchedRequests'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `backendStats.${row.key}.reDispatchedReq`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function BackendsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'backends'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        snapshotId,
        timeConfig
      };
    });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.hAProxy.dashboard.backendsWithCount', { count: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: msTwoDecimalPlaces,
          metrics: ['backendStats.' + row.key + '.avgResponseTime', 'backendStats.' + row.key + '.avgQueueTime'],
          labels: [
            t('in-forge:plugins.hAProxy.dashboard.averageResponseTime'),
            t('in-forge:plugins.hAProxy.dashboard.averageQueueTime')
          ],
          type: 'line'
        }}
        y2={{
          metrics: ['backendStats.' + row.key + '.queueSize'],
          labels: [t('in-forge:plugins.hAProxy.dashboard.queueSize')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          metrics: [
            'backendStats.' + row.key + '.reqConnErrors',
            'backendStats.' + row.key + '.connRetries',
            'backendStats.' + row.key + '.errorRes'
          ],
          labels: [
            t('in-forge:plugins.hAProxy.dashboard.connectionErrors'),
            t('in-forge:plugins.hAProxy.dashboard.connectionRetries'),
            t('in-forge:plugins.hAProxy.dashboard.responseErrors')
          ],
          type: 'stackedBar',
          aggregation: 'sum',
          formatter: number.compact
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          metrics: ['backendStats.' + row.key + '.deniedRes', 'backendStats.' + row.key + '.reDispatchedReq'],
          labels: [
            t('in-forge:plugins.hAProxy.dashboard.deniedResponses'),
            t('in-forge:plugins.hAProxy.dashboard.reDispatchedRequests')
          ],
          type: 'stackedBar',
          aggregation: 'sum',
          formatter: number.compact
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
