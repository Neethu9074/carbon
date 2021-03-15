/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { millis, number } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleServlet'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleRequests'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `servlets.${row.servletKey}.inv`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleAvgResponseTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `servlets.${row.servletKey}.time`;
      },
      getContent: millis.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `servlets.${row.servletKey}.errors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ServletsTable({ webAppContext, snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'servlets', webAppContext], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        servletKey: `${webAppContext}.${name}`,
        webAppContext,
        timeConfig,
        snapshotId
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tomcatAppContainer.titleServletsOfWebAppCount', {
        webAppContext: webAppContext,
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        formatter: millis.detailed,
        metrics: ['servlets.' + row.servletKey + '.time'],
        labels: [t('in-forge:plugins.tomcatAppContainer.labelAverageResponseTime')],
        type: 'line'
      }}
      y2={{
        metrics: ['servlets.' + row.servletKey + '.inv', 'servlets.' + row.servletKey + '.errors'],
        labels: [
          t('in-forge:plugins.tomcatAppContainer.titleRequests'),
          t('in-forge:plugins.tomcatAppContainer.titleErrors')
        ],
        type: 'line',
        formatter: number.detailed
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
