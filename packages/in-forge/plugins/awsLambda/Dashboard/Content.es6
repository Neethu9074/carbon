import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, millis } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

export default function AwsLambdaDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Invocations">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['invocations'],
            labels: ['Invocations'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Duration">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['duration', 'duration_maximum', 'duration_minimum'],
            labels: ['Average', 'Maximum', 'Minimum'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['duration_sum'],
            labels: ['Sum'],
            type: 'line',
            formatter: millis.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title="Errors">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['errors'],
            labels: ['Errors'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Throttles">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['throttles'],
            labels: ['Throttles'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Dead Letter Errors">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['dead_letter_error'],
            labels: ['Dead Letter Errors'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Iterator Age">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['iterator_age', 'iterator_age_maximum', 'iterator_age_minimum'],
            labels: ['Average', 'Maximum', 'Minimum'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['iterator_age_sum'],
            labels: ['Sum'],
            type: 'line',
            formatter: millis.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title="Concurrent Executions">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['concurrent_executions', 'concurrent_executions_maximum', 'concurrent_executions_minimum'],
            labels: ['Average', 'Maximum', 'Minimum'],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['concurrent_executions_sum'],
            labels: ['Sum'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Unreserved Concurrent Executions">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['unreserved_concurrent_executions'],
            labels: ['Unreserved Concurrent Executions'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}
