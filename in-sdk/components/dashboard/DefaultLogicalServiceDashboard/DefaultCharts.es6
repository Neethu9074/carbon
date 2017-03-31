import React from 'react';

import {
  msZeroDecimalPlaces,
  msTwoDecimalPlaces,
  twoDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

export default function DefaultCharts({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Calls/s vs. Average Latency">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 80
          }}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['count'],
            labels: ['calls/s'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: ['duration.mean'],
            labels: ['average latency'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Latency Overview">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          height={200}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: msZeroDecimalPlaces,
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
        <ChartWithLegend
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

      <DashboardSection title="Instances">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['instances'],
            labels: ['instances'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
