import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces, muSecondsToMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { emptyMap, emptyList } from 'in-services/fixedImmutables';
import Chart from 'in-components/Chart'
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'App Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Servlet Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.servletName;
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
        return 'servlets.' + row.key + '.' + row.servletName + '.requests';
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
        return 'servlets.' + row.key + '.' + row.servletName + '.avgResponseTime';
      },
      getContent: muSecondsToMillisTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ServletsTable({ snapshot, timeframe }) {
  const servlets = [];
  snapshot.getIn(['data', 'applications'], emptyMap).sort().forEach((appData, appName) => {
    appData.get('servlets', emptyList).sort().forEach(servletName => {
      servlets.push({
        appName: appName,
        servletName: servletName
      });
    });
  });
  if (servlets.length === 0) {
    return null;
  }

  const rows = servlets.map(servlet => {
    return {
      key: servlet.appName,
      servletName: servlet.servletName,
      snapshotId: snapshot.get('id'),
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
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80,
          right: 40
        }}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['servlets.' + row.key + '.' + row.servletName + '.requests'],
          labels: ['Requests'],
          type: 'line'
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80,
          right: 40
        }}
        y1={{
          formatter: muSecondsToMillisTwoDecimalPlaces,
          metrics: ['servlets.' + row.key + '.' + row.servletName + '.avgResponseTime'],
          labels: ['Average Response Time'],
          type: 'line'
        }}
      />
    </div>
  );
}
