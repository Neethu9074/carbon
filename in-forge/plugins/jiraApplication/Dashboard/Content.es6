import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart'

export default function JiraDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Traffic">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
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
          timeframe={timeframe}
          margins={{
            left: 80
          }}
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
