import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

export default function JiraDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Traffic">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['instruments.http.sessions'],
            labels: ['Current Sessions'],
            type: 'line'
          }}
          y2={{
            metrics: ['instruments.concurrent.requests'],
            labels: ['Concurrent Requests'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="DB Pool">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['instruments.dbcp.numIdle'],
            labels: ['Idle Connections'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
