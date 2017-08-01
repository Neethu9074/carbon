import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytes, number, percentage } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Frontend Name',
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
        return `frontendStats.${row.key}.reqRate`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Request Errors',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.reqErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Denied Requests',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.deniedReq`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Sessions',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.sessionRate`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Session Usage',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.sessionUtilization`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Client Errors',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.clientErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Server Errors',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.serverErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Bytes Sent',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.bytesSent`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Bytes Received',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `frontendStats.${row.key}.bytesReceived`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function FrontendsTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot.getIn(['data', 'frontends'], emptyList).toArray().map(name => {
    return {
      key: name,
      snapshotId,
      timeframe
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Frontends (${rows.length})`}>
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
          left: 80
        }}
        y1={{
          metrics: [
            'frontendStats.' + row.key + '.reqRate',
            'frontendStats.' + row.key + '.reqErrors',
            'frontendStats.' + row.key + '.deniedReq'
          ],
          labels: ['Requests', 'Request Errors', 'Denied Requests'],
          type: 'line'
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80,
          right: 80
        }}
        y1={{
          metrics: ['frontendStats.' + row.key + '.sessionRate'],
          labels: ['Sessions'],
          type: 'line'
        }}
        y2={{
          formatter: percentage.detailed,
          metrics: ['frontendStats.' + row.key + '.sessionUtilization'],
          labels: ['Session Usage'],
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
          metrics: ['frontendStats.' + row.key + '.clientErrors', 'frontendStats.' + row.key + '.serverErrors'],
          labels: ['Client Errors', 'Server Errors'],
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
          formatter: bytes.detailed,
          metrics: ['frontendStats.' + row.key + '.bytesSent', 'frontendStats.' + row.key + '.bytesReceived'],
          labels: ['Bytes Sent', 'Bytes Received'],
          type: 'line'
        }}
      />
    </div>
  );
}
