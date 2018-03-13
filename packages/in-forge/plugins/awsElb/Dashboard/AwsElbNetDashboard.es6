import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

export default function AwsElbNetDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="New Flow Count">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['new_flow_count'],
            labels: ['New Flow Count'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="TCP Resets (RST)">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['client_reset_count', 'elb_reset_count', 'target_reset_count'],
            labels: ['Client', 'Load Balancer', 'Target'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}
