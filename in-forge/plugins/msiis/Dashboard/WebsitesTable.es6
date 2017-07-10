import React from 'react';

import { bytesTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart'
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
    title: 'Current Connections',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName(row) {
        return 'siteperf.' + row.key + '.current_connections';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Requests',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName(row) {
        return 'siteperf.' + row.key + '.total_requests';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'GET Requests',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName(row) {
        return 'siteperf.' + row.key + '.get_requests';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'POST Requests',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName(row) {
        return 'siteperf.' + row.key + '.post_requests';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'PUT Requests',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName(row) {
        return 'siteperf.' + row.key + '.put_requests';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function WebsitesTable({ snapshot, timeframe }) {
  const webSites = snapshot.getIn(['data', 'allsites'], emptyList);
  if (webSites.size === 0) {
    return null;
  }

  const rows = webSites.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      timeframe
    };
  });

  return (
    <DashboardSection title={`Websites (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 60
        }}
        y1={{
          metrics: ['siteperf.' + name + '.total_requests'],
          labels: ['Total number of requests'],
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
          metrics: ['siteperf.' + name + '.current_connections'],
          labels: ['Current number of connections'],
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
          min: 0,
          metrics: [
            'siteperf.' + name + '.get_requests',
            'siteperf.' + name + '.post_requests',
            'siteperf.' + name + '.put_requests'
          ],
          labels: ['GET Requests', 'POST Requests', 'PUT Requests'],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: bytesTwoDecimalPlaces,
          metrics: ['siteperf.' + name + '.bytes_sent', 'siteperf.' + name + '.bytes_received'],
          labels: ['Bytes sent', 'Bytes received'],
          type: 'line'
        }}
      />
    </div>
  );
}
