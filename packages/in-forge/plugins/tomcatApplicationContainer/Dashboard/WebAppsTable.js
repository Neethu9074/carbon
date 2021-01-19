/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServletsInWebAppTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/ServletsInWebAppTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, minutes } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Context',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.webApp.get('name');
      }
    }
  },
  {
    title: 'Session Timeout',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.webApp.get('session-timeout');
      },
      getContent: minutes.compact
    }
  },
  {
    title: 'Number of Sessions',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `sessions.${row.key}`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function WebAppsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'webapps'], emptyMap)
    .map((webApp, context) => {
      return {
        key: context,
        webApp,
        snapshot,
        snapshotId,
        timeConfig
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={`Web Apps (${rows.length})`}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <ServletsInWebAppTable webAppContext={row.key} snapshot={row.snapshot} timeConfig={row.timeConfig} />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          metrics: ['sessions.' + row.key],
          labels: ['Sessions'],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
