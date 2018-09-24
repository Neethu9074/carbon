import React from 'react';

import { number, millis, bytes } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function AzureCosmosDbDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Response Times and Requests">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['rl', 'wl'],
            labels: ['Read Latency', 'Write Latency'],
            formatter: millis.detailed,
            type: 'line'
          }}
          y2={{
            metrics: ['tr'],
            labels: ['Total Requests'],
            formatter: number.detailed,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="HTTP Status Codes">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['h2'],
            labels: ['HTTP 2xx Responses'],
            formatter: number.detailed,
            type: 'line'
          }}
          y2={{
            metrics: ['h3'],
            labels: ['HTTP 3xx Responses'],
            formatter: number.detailed,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Performance">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['dc'],
            labels: ['Document Count'],
            formatter: number.detailed,
            type: 'stackedArea'
          }}
          y2={{
            metrics: ['ds', 'is'],
            labels: ['Data Size', 'Index Size'],
            formatter: number.detailed,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Capacity">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sc'],
            labels: ['Storage Capacity'],
            formatter: bytes.compact,
            type: 'line'
          }}
          y2={{
            metrics: ['as'],
            labels: ['Available Storage'],
            formatter: bytes.compact,
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
