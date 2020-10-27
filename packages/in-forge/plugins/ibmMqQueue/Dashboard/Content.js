import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { seconds, micros, number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function IbmMqQueueDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Queue Depth">
          <MetricValue snapshotId={snapshotId} metric="queueDepth" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Oldest Message">
          <MetricValue snapshotId={snapshotId} metric="oldestMessage" formatter={seconds.fixedCompact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Depth">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
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
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`messagesIn`, `messagesOut`, `uncommittedMessages`],
            labels: ['In', 'Out', 'Uncommitted'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Message Time">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: seconds.fixedCompact,
            tooltipFormatter: seconds.fixedCompacts,
            metrics: [`oldestMessage`],
            labels: ['Oldest'],
            type: 'line'
          }}
          y2={{
            formatter: micros.compact,
            tooltipFormatter: micros.compact,
            metrics: [`onQueueMessageTime`],
            labels: ['On Queue'],
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
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`openInputCount`, `openOutputCount`],
            labels: ['Open Input Count', 'Open Output Count'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
