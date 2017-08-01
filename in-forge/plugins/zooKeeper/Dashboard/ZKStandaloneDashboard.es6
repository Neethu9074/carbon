import React from 'react';

import { zeroDecimalPlaces, msZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function ZKStandaloneDashboard({ snapshot, timeframe }) {
  return (
    <div>
      <DashboardSection title="Latency">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 40,
            right: 40
          }}
          y1={{
            min: 0,
            metrics: ['avg_request_latency'],
            labels: ['Average request latency'],
            type: 'line',
            formatter: msZeroDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['max_request_latency', 'min_request_latency'],
            labels: ['Max request latency', 'Min request latency'],
            type: 'line',
            formatter: msZeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 40
          }}
          y1={{
            min: 0,
            metrics: ['outstanding_requests'],
            labels: ['Outstanding Requests'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 40
          }}
          y1={{
            min: 0,
            metrics: ['num_alive_connections'],
            labels: ['Alive connections'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Packets">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 40,
            right: 40
          }}
          y1={{
            min: 0,
            metrics: ['packets_received'],
            labels: ['Packets Received'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['packets_sent'],
            labels: ['Packets Sent'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
    </div>
  );
}
