import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import ChartWithLegend from 'in-components/ChartWithLegend';
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
    type: 'string',
    typeArgs: {
      getValue(row) {
        return String(row.data.get('webApps.' + row.key + '.sessionTimeout'));
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

export default function WebAppsTable({ snapshot, timeframe }) {
  const contextRootPaths = snapshot.getIn(['data', 'contextsToServlets'], emptyMap);
  if (contextRootPaths.size === 0) {
    return null;
  }
  const rows = contextRootPaths.keySeq().toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      snapshot,
      data: snapshot.get('data'),
      timeframe
    };
  });

  return (
    <DashboardSection title={`Web Deployments (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <ServletsInWebAppTable contextRootPath={row.key} snapshot={row.snapshot} timeframe={row.timeframe} />

      <ChartWithLegend
        snapshotId={row.snapshot.get('id')}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['webApps.' + row.key + '.activeSessions', 'webApps.' + row.key + '.createdSessions'],
          labels: ['Active Sessions', 'Created Sessions'],
          type: 'line',
          min: 0
        }}
      />
    </div>
  );
}
