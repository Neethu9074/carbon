import React from 'react';

import { zeroDecimalPlaces, msZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Number of Sessions',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'sessionManagers.' + row.key + '.activeCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Servlets Requests',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'servlets.' + row.key + '.requests';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Servlets Average Response Time',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'servlets.' + row.key + '.avgResponseTime';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Servlets Errors',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'servlets.' + row.key + '.errors';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function WebModulesTable({ snapshot, timeframe }) {
  const webModules = snapshot.getIn(['data', 'webModules'], emptyList);
  if (webModules.size === 0) {
    return null;
  }

  const rows = webModules.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      timeframe
    };
  });

  return (
    <DashboardSection title={`Web Modules (${rows.length})`}>
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
          formatter: zeroDecimalPlaces,
          metrics: ['sessionManagers.' + row.key + '.activeCount'],
          labels: ['Sessions'],
          type: 'line'
        }}
      />
      <ChartWithLegend
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80,
          right: 40
        }}
        y1={{
          formatter: msZeroDecimalPlaces,
          metrics: ['servlets.' + row.key + '.avgResponseTime'],
          labels: ['Average Response Time'],
          type: 'line'
        }}
        y2={{
          formatter: zeroDecimalPlaces,
          metrics: ['servlets.' + row.key + '.requests', 'servlets.' + row.key + '.errors'],
          labels: ['Request Count', 'Errors'],
          type: 'line'
        }}
      />
    </div>
  );
}
