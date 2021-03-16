/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { zeroDecimalPlaces, bytesTwoDecimalPlaces, millis } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.azureApiManagement.dashboard.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        var version = row.api.get('apiVersion');

        if (version) {
          return row.api.get('displayName') + ' (' + version + ')';
        } else {
          return row.api.get('displayName');
        }
      }
    }
  },
  {
    title: t('in-forge:plugins.azureApiManagement.dashboard.titleCalls'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.apis.${row.key}.callCountTotal`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureApiManagement.dashboard.titleBandwidth'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.apis.${row.key}.bandwidth`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureApiManagement.dashboard.titleAPIResponseTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.apis.${row.key}.apiTimeAvg`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },

  {
    title: t('in-forge:plugins.azureApiManagement.dashboard.titleServiceResponseTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.apis.${row.key}.serviceTimeAvg`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  }
];

export default function ApisTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'apis'], emptyMap)
    .map((api, key) => {
      return {
        key,
        api,
        timeConfig,
        snapshotId
      };
    })
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureApiManagement.dashboard.titleApiCount', { apiCount: rows.length })}
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
          formatter: zeroDecimalPlaces,
          metrics: [
            'metrics.apis.' + row.key + '.callCountTotal',
            'metrics.apis.' + row.key + '.callCountSuccess',
            'metrics.apis.' + row.key + '.callCountBlocked',
            'metrics.apis.' + row.key + '.callCountFailed',
            'metrics.apis.' + row.key + '.callCountOther'
          ],
          labels: [
            t('in-forge:plugins.azureApiManagement.dashboard.labelTotalCalls'),
            t('in-forge:plugins.azureApiManagement.dashboard.labelSuccessfulCalls'),
            t('in-forge:plugins.azureApiManagement.dashboard.labelBlockedCalls'),
            t('in-forge:plugins.azureApiManagement.dashboard.labelFailedCalls'),
            t('in-forge:plugins.azureApiManagement.dashboard.labelOtherCalls')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytesTwoDecimalPlaces,
          metrics: ['metrics.apis.' + row.key + '.bandwidth'],
          labels: [t('in-forge:plugins.azureApiManagement.dashboard.labelOtherBandwidth')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.apis.' + row.key + '.cacheHitCount', 'metrics.apis.' + row.key + '.cacheMissCount'],
          labels: [
            t('in-forge:plugins.azureApiManagement.dashboard.labelCacheHits'),
            t('in-forge:plugins.azureApiManagement.dashboard.labelCacheMisses')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: millis.detailed,
            metrics: [
              'metrics.apis.' + row.key + '.apiTimeAvg',
              'metrics.apis.' + row.key + '.apiTimeMin',
              'metrics.apis.' + row.key + '.apiTimeMax'
            ],
            labels: [
              t('in-forge:plugins.azureApiManagement.dashboard.labelAPIAverageResponseTime'),
              t('in-forge:plugins.azureApiManagement.dashboard.labelAPIMinimumResponseTime'),
              t('in-forge:plugins.azureApiManagement.dashboard.labelAPIMaximumResponseTime')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />

        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: millis.detailed,
            metrics: [
              'metrics.apis.' + row.key + '.serviceTimeAvg',
              'metrics.apis.' + row.key + '.serviceTimeMin',
              'metrics.apis.' + row.key + '.serviceTimeMax'
            ],
            labels: [
              t('in-forge:plugins.azureApiManagement.dashboard.labelServiceAverageResponseTime'),
              t('in-forge:plugins.azureApiManagement.dashboard.labelServiceMinimumResponseTime'),
              t('in-forge:plugins.azureApiManagement.dashboard.labelServiceMaximumResponseTime')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
    </div>
  );
}
