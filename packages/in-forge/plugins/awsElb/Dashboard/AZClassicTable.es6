import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { emptyList } from 'in-services/fixedImmutables';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Availability Zone',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Request count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'azMetrics.' + row.key + '.request_count';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Latency',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'azMetrics.' + row.key + '.latency';
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function AZClassicTable({ snapshot, timeConfig }) {
  const availabilityZones = snapshot.getIn(['data', 'availability_zones'], emptyList);
  if (availabilityZones.size === 0) {
    return null;
  }
  const rows = availabilityZones
    .map(availabilityZone => {
      return {
        key: availabilityZone,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    })
    .toArray();

  return (
    <DashboardSection title={`Availability Zones (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  const id = row.key;
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [
            'azMetrics.' + id + '.request_count',
            'azMetrics.' + id + '.target_2XX_count',
            'azMetrics.' + id + '.target_3XX_count',
            'azMetrics.' + id + '.target_4XX_count',
            'azMetrics.' + id + '.target_5XX_count'
          ],
          labels: [
            'All Requests',
            'Requests with Status Code 2xx',
            'Requests with Status Code 3xx',
            'Requests with Status Code 4xx',
            'Requests with Status Code 5xx'
          ],
          type: 'line',
          formatter: number.compact
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: ['azMetrics.' + id + '.latency'],
          labels: ['Response Time'],
          type: 'line',
          formatter: millis.detailed
        }}
        y2={{
          min: 0,
          metrics: ['azMetrics.' + id + '.backend_connection_errors'],
          labels: ['Connection Error Count'],
          type: 'line',
          formatter: number.compact
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: ['azMetrics.' + id + '.surge_queue_length'],
          labels: ['Surge queue length'],
          type: 'line',
          formatter: number.compact
        }}
        y2={{
          min: 0,
          metrics: ['azMetrics.' + id + '.spillover_count'],
          labels: ['Spillover count'],
          type: 'line',
          formatter: number.compact
        }}
      />
    </div>
  );
}
