import React from 'react';

import { number, millis } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function AzureAppServiceDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Response Times and Requests">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['art'],
            labels: ['Response Time'],
            formatter: millis.detailed,
            type: 'line'
          }}
          y2={{
            metrics: ['trs', 'qrs'],
            labels: ['Total Requests', 'Queued Requests'],
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
            metrics: ['h2x', 'h4x', 'h5x'],
            labels: ['HTTP 2xx Responses', 'HTTP 4xx Responses', 'HTTP 5xx Responses'],
            formatter: number.detailed,
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </div>
  );
}
