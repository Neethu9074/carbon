import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces, seconds } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

export default function IBMMQQueueDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title="Depth">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`maxQueueDepth`, `queueDepth`],
            labels: ['Max', 'Current'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Messages">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`messagesIn`, `messagesOut`, `uncommittedMessages`],
            labels: ['In', 'Out', 'Uncommiited'],
            type: 'line'
          }}
          y2={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`oldestMessage`, `onQueueMessageTime`],
            labels: ['Oldest', 'On Queue'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Reset">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: seconds.fixedCompact,
            tooltipFormatter: seconds.fixedCompact,
            metrics: [`lastResetTime`],
            labels: ['Last'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Calls">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`openInputCount`, `openOutputCount`],
            labels: ['Open Input Count', 'Open Output Count'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
