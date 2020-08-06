import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default function IBMMQChannelDashboard({ snapshot, timeConfig }) {
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
            metrics: [`messagesSent`, `messagesAvailable`],
            labels: ['Sent/Received', 'Available'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Sequence Number">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`sequenceNumberCurrent`, `sequenceNumberLast`],
            labels: ['Current', 'Last'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Buffers">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`buffersSent`, `buffersReceived`],
            labels: ['Sent', 'Received'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
