/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, millis } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

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
    title: 'Response Time',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'azMetrics.' + row.key + '.target_response_time';
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
    <Table
      withoutPadding
      cardTitle={`Availability Zones (${rows.length})`}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
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
          labels: ['All Requests', '2xx', '3xx', '4xx', '5xx'],
          type: 'line',
          formatter: number.compact
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: ['azMetrics.' + id + '.target_response_time'],
          labels: ['Response Time'],
          type: 'line',
          formatter: millis.detailed
        }}
        y2={{
          min: 0,
          metrics: ['azMetrics.' + id + '.target_connection_error_count'],
          labels: ['Connection Error Count'],
          type: 'line',
          formatter: number.compact
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [
            'azMetrics.' + id + '.client_tls_negotiation_error_count',
            'azMetrics.' + id + '.target_tls_negotiation_error_count'
          ],
          labels: ['Client TLS Negotiation Error Count', 'Target TLS Negotiation Error Count'],
          type: 'line',
          formatter: number.compact
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
