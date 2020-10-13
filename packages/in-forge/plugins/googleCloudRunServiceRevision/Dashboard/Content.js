import React from 'react';

import { millis, millisPerSecondZeroDecimalPlaces, number, percentage } from 'in-services/formatters/number';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import DashboardInstanceList from './DashboardInstanceList';
import MetricValue from 'in-components/MetricValue';

export default function GoogleCloudRunServiceRevisionDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <>
      <KpiSection>
        <KpiKeyValue label="Request Count">
          <MetricValue snapshotId={snapshotId} metric="request_count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Request Latency (P99)">
          <MetricValue snapshotId={snapshotId} metric="request_latencies_p99" formatter={millis.compact} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="Request Count">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.compact,
              metrics: [`request_count`],
              labels: ['Requests'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Request Latency">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: millis.compact,
              tooltipFormatter: millis.compact,
              metrics: ['request_latencies_p99', 'request_latencies_p95', 'request_latencies_p50'],
              labels: ['99th Percentile', '95th Percentile', '50th Percentile'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Container Memory Utilization">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentage.compact,
              tooltipFormatter: percentage.compact,
              metrics: [
                'container_memory_utilizations_p99',
                'container_memory_utilizations_p95',
                'container_memory_utilizations_p50'
              ],
              labels: ['99th Percentile', '95th Percentile', '50th Percentile'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Billable Instance Time">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: millisPerSecondZeroDecimalPlaces,
              tooltipFormatter: millisPerSecondZeroDecimalPlaces,
              metrics: ['container_billable_instance_time'],
              labels: ['Instance Time'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <DashboardInstanceList snapshotId={snapshotId} />
    </>
  );
}
