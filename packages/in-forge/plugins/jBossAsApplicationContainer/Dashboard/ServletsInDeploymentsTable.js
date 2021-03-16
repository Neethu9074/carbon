/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, millis } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.servlet'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.requests'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'servlets.' + row.servletKey + '.requests';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.averageResponseTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'servlets.' + row.servletKey + '.avgResponseTime';
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ServletsTable({ deploymentContext, snapshot, timeConfig }) {
  const servlets = snapshot.getIn(['data', 'servlets', deploymentContext], emptyList);
  if (servlets.size === 0) {
    return null;
  }

  const rows = servlets.toArray().map(key => {
    const servletKey = deploymentContext + '.' + key;
    return {
      key,
      timeConfig,
      snapshotId: snapshot.get('id'),
      deploymentContext,
      servletKey
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.jBossAsApplicationContainer.servletsWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  const servletKey = row.deploymentContext + '.' + row.key;

  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          metrics: ['servlets.' + servletKey + '.requests'],
          labels: [t('in-forge:plugins.jBossAsApplicationContainer.requests')],
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
          formatter: millis.detailed,
          metrics: ['servlets.' + servletKey + '.avgResponseTime'],
          labels: [t('in-forge:plugins.jBossAsApplicationContainer.averageResponseTime')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
