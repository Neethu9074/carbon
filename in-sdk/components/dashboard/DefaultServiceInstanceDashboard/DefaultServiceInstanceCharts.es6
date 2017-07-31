import React from 'react';

import {
  msZeroDecimalPlaces,
  msTwoDecimalPlaces,
  number,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function DefaultCharts({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Calls vs. Average Latency">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 80
          }}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['count'],
            labels: ['calls'],
            type: 'bar',
            aggregation: 'sum'
          }}
          y2={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: ['duration.mean'],
            labels: ['average latency'],
            type: 'discreteLine',
            aggregation: 'mean'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Latency Overview">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          height={400}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: msZeroDecimalPlaces,
            tooltipFormatter: msTwoDecimalPlaces,
            metrics: [
              'duration.min',
              'duration.25th',
              'duration.50th',
              'duration.75th',
              'duration.95th',
              'duration.98th',
              'duration.99th',
              'duration.max'
            ],
            labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
            type: 'integral'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Errors/s">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: percentageTwoDecimalPlaces,
            metrics: ['error_rate'],
            labels: ['error rate'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
