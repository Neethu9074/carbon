import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Web App',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
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
        return `webAppsSessionData.${row.name}.sessions`;
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
    .getIn(['data', 'webApps'], emptyList)
    .toArray()
    .filter(webApp => webApp.get('state') === 'STARTED')
    .map((webApp, i) => {
      return {
        key: i,
        name: webApp.get('displayName') || '<unnamed>',
        timeframe,
        snapshotId
      };
    });

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
      <ChartWithLegend
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          metrics: ['webAppsSessionData.' + row.name + '.sessions'],
          labels: ['Active Sessions'],
          type: 'line'
        }}
      />
    </div>
  );
}
