/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
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
            formatter: number.compact,
            tooltipFormatter: number.compact,
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
            formatter: number.compact,
            tooltipFormatter: number.compact,
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
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`buffersSent`, `buffersReceived`],
            labels: ['Sent', 'Received'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
