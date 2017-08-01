import React from 'react';

import { msZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
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

export default function ServletsInWebAppTable({ contextRootPath, snapshot, timeframe }) {
  const servlets = snapshot.getIn(['data', 'contextsToServlets', contextRootPath], emptyList);
  if (servlets.size === 0) {
    return null;
  }

  const rows = servlets.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      servletKey: contextRootPath + '/' + key,
      timeframe
    };
  });

  return (
    <DashboardSection title={`Servlets (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  const servletKey = row.servletKey;

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
          formatter: zeroDecimalPlaces,
          metrics: ['servlets.' + servletKey + '.requests'],
          labels: ['Requests'],
          type: 'line'
        }}
      />
    </div>
  );
}
