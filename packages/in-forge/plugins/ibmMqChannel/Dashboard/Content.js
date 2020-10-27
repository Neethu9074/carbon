import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces, number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function IbmMqChannelDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Messages Sent">
          <MetricValue snapshotId={snapshotId} metric="messagesSent" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Messages Available">
          <MetricValue snapshotId={snapshotId} metric="messagesAvailable" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
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
