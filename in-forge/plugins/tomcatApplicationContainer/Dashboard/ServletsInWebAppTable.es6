import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { millis, number } from 'in-services/formatters/number';
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
        return `servlets.${row.servletKey}.inv`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Avg. Response Time',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `servlets.${row.servletKey}.time`;
      },
      getContent: millis.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Errors',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `servlets.${row.servletKey}.errors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ServletsTable({ webAppContext, snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot.getIn(['data', 'servlets', webAppContext], emptyList).toArray().map(name => {
    return {
      key: name,
      servletKey: `${webAppContext}.${name}`,
      webAppContext,
      timeframe,
      snapshotId
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Servlets of ${webAppContext} (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 80,
        right: 40
      }}
      y1={{
        formatter: millis.detailed,
        metrics: ['servlets.' + row.servletKey + '.time'],
        labels: ['Average Response Time'],
        type: 'line'
      }}
      y2={{
        metrics: ['servlets.' + row.servletKey + '.inv', 'servlets.' + row.servletKey + '.errors'],
        labels: ['Request Count', 'Errors'],
        type: 'line',
        formatter: number.detailed
      }}
    />
  );
}
