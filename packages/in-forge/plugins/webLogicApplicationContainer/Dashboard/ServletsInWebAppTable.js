/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { msZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.webLogicAppContainer.titleServlet'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.webLogicAppContainer.titleRequests'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'servlets.' + row.servletKey + '.requests';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webLogicAppContainer.titleAverageResponseTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'servlets.' + row.servletKey + '.avgResponseTime';
      },
      getContent: msZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ServletsInWebAppTable({ contextRootPath, snapshot, timeConfig }) {
  const servlets = snapshot.getIn(['data', 'contextsToServlets', contextRootPath], emptyList);
  if (servlets.size === 0) {
    return null;
  }

  const rows = servlets.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      servletKey: contextRootPath + '/' + key,
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.webLogicAppContainer.titleServletsCount', {
        len: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  const servletKey = row.servletKey;

  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['servlets.' + servletKey + '.requests'],
          labels: [t('in-forge:plugins.webLogicAppContainer.titleRequests')],
          type: 'line'
        }}
        y2={{
          formatter: msZeroDecimalPlaces,
          metrics: ['servlets.' + servletKey + '.avgResponseTime'],
          labels: [t('in-forge:plugins.webLogicAppContainer.titleAverageResponseTime')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
