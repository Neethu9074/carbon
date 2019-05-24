import React, { Fragment } from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage, number } from 'in-services/formatters/number';

export default function ApplicationDataStatistics({ timeConfig, tenantUnitId }) {
  return (
    <Fragment>
      <DashboardSection title={`Backend Dropped Spans`}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentage.detailed,
            metrics: [`appdata-processor.spanDropping`],
            labels: ['Backend Dropped Spans'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`Processed Spans`}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: [`appdata-processor.processedSpans`],
            labels: ['Processed Spans'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`Dropped Spans due to Configuration`}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: [`appdata-processor.droppedSpansDueToConfiguration`],
            labels: ['Dropped Spans due to Configuration'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
