/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { number, seconds, bytes, micros } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';

export default function GcpPubSubSubscriptionDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Messages Size">
          <MetricValue snapshotId={snapshotId} metric="backlog_bytes" formatter={bytes.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label="Undelivered Messages">
          <MetricValue snapshotId={snapshotId} metric="num_undelivered_messages" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Messages">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [`backlog_bytes`],
            labels: ['Size'],
            type: 'line',
            formatter: bytes.detailed
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
            metrics: [
              `ack_message_count`,
              `num_undelivered_messages`,
              `dead_letter_message_count`,
              `num_outstanding_messages`,
              `sent_message_count`
            ],
            labels: ['Acked', 'Unacked', 'Dead Letter', 'Outstanding', 'Sent'],
            type: 'line'
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
            metrics: [`oldest_retained_acked_message_age`, `oldest_unacked_message_age`],
            labels: ['Acked', 'Unacked'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Message Operations">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`pull_message_operation_count`, `pull_ack_message_operation_count`],
            labels: ['Pull', 'Ack'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`pull_request_count`, `push_request_count`, `pull_ack_request_count`],
            labels: ['Pull', 'Push', 'Ack'],
            type: 'line'
          }}
          y2={{
            formatter: micros.detailed,
            metrics: [`push_request_latencies`],
            labels: ['Push Latency'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title="Config Updates">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [`config_updates_count`],
              labels: ['Count'],
              type: 'line',
              formatter: number.compact
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
      </Columize>
    </div>
  );
}
