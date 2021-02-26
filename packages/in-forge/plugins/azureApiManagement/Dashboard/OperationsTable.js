/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { zeroDecimalPlaces, bytesTwoDecimalPlaces, millis } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyMap, emptyList } from 'in-services/fixedImmutables';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.azureApiManagement.dashboard.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.operation.get('displayName');
      }
    }
  },
  {
    title: t('in-forge:plugins.azureApiManagement.dashboard.titleApi'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        var apiDisplayName = row.api.get('displayName');
        var apiVersion = row.api.get('apiVersion');

        if (apiVersion) {
          apiDisplayName += ' (' + apiVersion + ')';
        }

        return apiDisplayName;
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
        return `metrics.operations.${row.key}.callCountTotal`;
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
        return `metrics.operations.${row.key}.bandwidth`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureApiManagement.dashboard.titleApiResponseTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.operations.${row.key}.apiTimeAvg`;
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
        return `metrics.operations.${row.key}.serviceTimeAvg`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  }
];

export default function OperationsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  var rows = emptyList;

  snapshot.getIn(['data', 'apis'], emptyMap).map(api => {
    api.getIn(['operations'], emptyMap).forEach(operation => {
      const key = api.get('name') + '.' + operation.get('name');
      rows = rows.push({
        key,
        api,
        operation,
        timeConfig,
        snapshotId
      });
    });
  });

  if (rows.count() === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureApiManagement.dashboard.titleServiceResponseTime', { ops: rows.size })}
      cols={cols}
      rows={rows.toArray()}
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
            'metrics.operations.' + row.key + '.callCountTotal',
            'metrics.operations.' + row.key + '.callCountSuccess',
            'metrics.operations.' + row.key + '.callCountBlocked',
            'metrics.operations.' + row.key + '.callCountFailed',
            'metrics.operations.' + row.key + '.callCountOther'
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
          metrics: ['metrics.operations.' + row.key + '.bandwidth'],
          labels: [t('in-forge:plugins.azureApiManagement.dashboard.labelBandwidth')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: [
            'metrics.operations.' + row.key + '.cacheHitCount',
            'metrics.operations.' + row.key + '.cacheMissCount'
          ],
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
              'metrics.operations.' + row.key + '.apiTimeAvg',
              'metrics.operations.' + row.key + '.apiTimeMin',
              'metrics.operations.' + row.key + '.apiTimeMax'
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
              'metrics.operations.' + row.key + '.serviceTimeAvg',
              'metrics.operations.' + row.key + '.serviceTimeMin',
              'metrics.operations.' + row.key + '.serviceTimeMax'
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
