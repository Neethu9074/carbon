import React, { Fragment } from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage, number, millis } from 'in-services/formatters/number';
import theme from 'in-themes';

export default function ApplicationDataStatistics({ timeConfig, tenantUnitId }) {
  return (
    <Fragment>
      <DashboardSection title={`Backend Span Dropping`}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentage.detailed,
            metrics: [`appdata-processor.spanDropping`],
            labels: ['Dropping rate'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: number.compact,
            metrics: [
              `appdata-processor.processedSpans`,
              `appdata-processor.droppedSpansDueToConfiguration`,
              `appdata-processor.droppedSpansDueToConsistentDropping`,
              `appdata-processor.droppedSpansDueToBackpressure`
            ],
            labels: [
              'Processed',
              'Dropped due to throttler',
              'Dropped due to consistent dropping',
              'Dropped due to backpressure'
            ],
            colors: [
              theme.lib.colors.success,
              theme.lib.colors.red800,
              theme.lib.colors.orange800,
              theme.lib.colors.yellow800
            ],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`Span latency`}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: millis.compact,
            metrics: [
              `appdata-processor.spanLatency.mean`,
              `appdata-processor.spanLatency.50th`,
              `appdata-processor.spanLatency.99th`
            ],
            labels: ['Mean', '50th', '99th'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
