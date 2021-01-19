/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import ServletsInWebAppTable from './ServletsInWebAppTable';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Context Root',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Status',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('webApps.' + row.key + '.status');
      }
    }
  },
  {
    title: 'Session Timeout',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.data.get('webApps.' + row.key + '.sessionTimeout');
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: 'Active Sessions',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'webApps.' + row.key + '.activeSessions';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function WebAppsTable({ snapshot, timeConfig }) {
  const contextRootPaths = snapshot.getIn(['data', 'contextsToServlets'], emptyMap);
  if (contextRootPaths.size === 0) {
    return null;
  }
  const rows = contextRootPaths
    .keySeq()
    .toArray()
    .map(key => {
      return {
        key,
        snapshotId: snapshot.get('id'),
        snapshot,
        data: snapshot.get('data'),
        timeConfig
      };
    });

  return (
    <Table
      withoutPadding
      cardTitle={`Web Deployments (${rows.length})`}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <ServletsInWebAppTable contextRootPath={row.key} snapshot={row.snapshot} timeConfig={row.timeConfig} />

      <Chart
        snapshotId={row.snapshot.get('id')}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['webApps.' + row.key + '.activeSessions', 'webApps.' + row.key + '.createdSessions'],
          labels: ['Active Sessions', 'Created Sessions'],
          type: 'line',
          min: 0
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
