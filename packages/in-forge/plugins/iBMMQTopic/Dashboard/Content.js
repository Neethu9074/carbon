import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default function IBMMQTopicDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title="Messages">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`messagesCount`],
            labels: ['Count'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Publish">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`publishCount`],
            labels: ['Count'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Subscription">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`subscriptionCount`],
            labels: ['Count'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
