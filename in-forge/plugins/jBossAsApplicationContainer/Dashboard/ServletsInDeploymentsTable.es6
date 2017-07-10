import React from 'react';

import { zeroDecimalPlaces, msZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart'
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Servlet',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Requests',
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
    title: 'Average Response Time',
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

export default function ServletsTable({ deploymentContext, snapshot, timeframe }) {
  const servlets = snapshot.getIn(['data', 'servlets', deploymentContext], emptyList);
  if (servlets.size === 0) {
    return null;
  }

  const rows = servlets.toArray().map(key => {
    const servletKey = deploymentContext + '.' + key;
    return {
      key,
      timeframe,
      snapshotId: snapshot.get('id'),
      deploymentContext,
      servletKey
    };
  });

  return (
    <DashboardSection title={`Servlets (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  const servletKey = row.deploymentContext + '.' + row.key;

  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: msZeroDecimalPlaces,
          metrics: ['servlets.' + servletKey + '.avgResponseTime'],
          labels: ['Average Response Time'],
          type: 'line'
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          metrics: ['servlets.' + servletKey + '.requests'],
          labels: ['Requests'],
          type: 'line'
        }}
      />
    </div>
  );
}
