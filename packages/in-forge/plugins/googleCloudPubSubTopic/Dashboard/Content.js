import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes, seconds } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function GcpPubSubTopicDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Messages Size">
          <MetricValue snapshotId={snapshotId} metric="message_sizes" formatter={bytes.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label="Oldest Unacked Message Age">
          <MetricValue snapshotId={snapshotId} metric="oldest_unacked_message_age" formatter={seconds.detailed} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Messages">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['message_sizes'],
            labels: ['Size'],
            type: 'line',
            formatter: bytes.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title="Oldest Message Age">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: seconds.detailed,
            tooltipFormatter: seconds.detailed,
            metrics: [`oldest_retained_acked_message_age`],
            labels: ['Acked'],
            type: 'line'
          }}
          y2={{
            formatter: seconds.detailed,
            tooltipFormatter: seconds.detailed,
            metrics: [`oldest_unacked_message_age`],
            labels: ['Unacked'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Publish">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`send_message_operation_count`],
            labels: ['Operation'],
            type: 'line'
          }}
          y2={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`send_request_count`],
            labels: ['Requests'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Operations">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [`byte_cost`],
            labels: ['Cost'],
            type: 'line',
            formatter: bytes.detailed
          }}
        />
      </DashboardSection>
    </div>
  );
}
