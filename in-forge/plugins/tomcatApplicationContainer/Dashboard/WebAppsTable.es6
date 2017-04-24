import React from 'react';

import ServletsInWebAppTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/ServletsInWebAppTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
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

export default function WebAppsTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'webapps'], emptyMap)
    .map((webApp, context) => {
      return {
        key: context,
        webApp,
        snapshot,
        snapshotId,
        timeframe
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Web Apps (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <ServletsInWebAppTable webAppContext={row.key} snapshot={row.snapshot} timeframe={row.timeframe} />

      <ChartWithLegend
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          metrics: ['sessions.' + row.key],
          labels: ['Sessions'],
          type: 'line'
        }}
      />
    </div>
  );
}
