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

export default function IbmMqTopicDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Messages">
          <MetricValue snapshotId={snapshotId} metric="messagesCount" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Publishers">
          <MetricValue snapshotId={snapshotId} metric="publishCount" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Messages">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`messagesCount`],
            labels: ['Count'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Publishers">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`publishCount`],
            labels: ['Count'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Subscriptions">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`subscriptionCount`],
            labels: ['Count'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
