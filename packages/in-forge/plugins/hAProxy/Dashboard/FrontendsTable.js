/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { bytes, number, percentage } from 'in-services/formatters/number';
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
    title: t('in-forge:plugins.hAProxy.dashboard.requests'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.reqRate`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.requestErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.reqErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.deniedRequests'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.deniedReq`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.sessions'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.sessionRate`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.sessionUsage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.sessionUtilization`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.clientErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.clientErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.serverErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.serverErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.bytesSent'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.bytesSent`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.hAProxy.dashboard.bytesReceived'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.bytesReceived`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function FrontendsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'frontends'], emptyList)
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
      cardTitle={t('in-forge:plugins.hAProxy.dashboard.frontendsWithCount', { len: rows.length })}
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
          metrics: [
            'frontendStats.' + row.key + '.reqRate',
            'frontendStats.' + row.key + '.reqErrors',
            'frontendStats.' + row.key + '.deniedReq'
          ],
          labels: [
            t('in-forge:plugins.hAProxy.dashboard.requests'),
            t('in-forge:plugins.hAProxy.dashboard.requestErrors'),
            t('in-forge:plugins.hAProxy.dashboard.deniedRequests')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          metrics: ['frontendStats.' + row.key + '.sessionRate'],
          labels: [t('in-forge:plugins.hAProxy.dashboard.sessions')],
          type: 'line'
        }}
        y2={{
          formatter: percentage.detailed,
          metrics: ['frontendStats.' + row.key + '.sessionUtilization'],
          labels: [t('in-forge:plugins.hAProxy.dashboard.sessionUsage')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          metrics: ['frontendStats.' + row.key + '.clientErrors', 'frontendStats.' + row.key + '.serverErrors'],
          labels: [
            t('in-forge:plugins.hAProxy.dashboard.clientErrors'),
            t('in-forge:plugins.hAProxy.dashboard.serverErrors')
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
          formatter: bytes.detailed,
          metrics: ['frontendStats.' + row.key + '.bytesSent', 'frontendStats.' + row.key + '.bytesReceived'],
          labels: [
            t('in-forge:plugins.hAProxy.dashboard.bytesSent'),
            t('in-forge:plugins.hAProxy.dashboard.bytesReceived')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
