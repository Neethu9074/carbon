/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { zeroDecimalPlaces, muSecondsToMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyMap, emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleAppName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleServletName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.servletName;
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleRequests'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'servlets.' + row.key + '.' + row.servletName + '.requests';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereLibertyAppContainer.titleAvgResponseTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'servlets.' + row.key + '.' + row.servletName + '.avgResponseTime';
      },
      getContent: muSecondsToMillisTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ServletsTable({ snapshot, timeConfig }) {
  const servlets = [];
  snapshot
    .getIn(['data', 'applications'], emptyMap)
    .sort()
    .forEach((appData, appName) => {
      appData
        .get('servlets', emptyList)
        .sort()
        .forEach(servletName => {
          servlets.push({
            appName: appName,
            servletName: servletName
          });
        });
    });
  if (servlets.length === 0) {
    return null;
  }

  const rows = servlets.map(servlet => {
    return {
      key: servlet.appName,
      servletName: servlet.servletName,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.webSphereLibertyAppContainer.titleServletsCount', {
        len: rows.length
      })}
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
          metrics: ['servlets.' + row.key + '.' + row.servletName + '.requests'],
          labels: [t('in-forge:plugins.webSphereLibertyAppContainer.titleRequests')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: muSecondsToMillisTwoDecimalPlaces,
          metrics: ['servlets.' + row.key + '.' + row.servletName + '.avgResponseTime'],
          labels: [t('in-forge:plugins.webSphereLibertyAppContainer.titleAvgResponseTime')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
