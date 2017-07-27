import React from 'react';

import { msTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import Chart from 'in-components/Chart';

export default function PageCharts({ snapshotId, timeframe, metricPrefix = '' }) {
  return (
    <div>
      <TwoColumnRow>
        <DashboardSection title="Views">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              formatter: twoDecimalPlaces,
              metrics: [metricPrefix + 'count'],
              labels: ['views'],
              type: 'bar',
              aggregation: 'sum',
              minPixelPerBlock: 10,
              maxDataPoints: 100
            }}
          />
        </DashboardSection>

        <DashboardSection title="XHR / AJAX">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80,
              right: 80
            }}
            y1={{
              min: 0,
              formatter: twoDecimalPlaces,
              metrics: [metricPrefix + 'xhrCalls'],
              labels: ['Calls'],
              type: 'line'
            }}
            y2={{
              min: 0,
              formatter: twoDecimalPlaces,
              metrics: [metricPrefix + 'xhrErrors'],
              labels: ['Errors'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </TwoColumnRow>

      <DashboardSection title="Uncaught Errors">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: [metricPrefix + 'uncaughtErrors'],
            labels: ['Uncaught errors'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Page Load Time">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          height={200}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: [
              metricPrefix + 'duration.min',
              metricPrefix + 'duration.25th',
              metricPrefix + 'duration.50th',
              metricPrefix + 'duration.75th',
              metricPrefix + 'duration.95th',
              metricPrefix + 'duration.98th',
              metricPrefix + 'duration.99th',
              metricPrefix + 'duration.max'
            ],
            labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
            type: 'integral'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Page Load Breakdown (95th)">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: [
              metricPrefix + 'unl',
              metricPrefix + 'red',
              metricPrefix + 'apc',
              metricPrefix + 'dns',
              metricPrefix + 'tcp',
              metricPrefix + 'ssl',
              metricPrefix + 'req',
              metricPrefix + 'rsp',
              metricPrefix + 'pro',
              metricPrefix + 'loa'
            ],
            labels: [
              'Unload',
              'Redirect',
              'AppCache',
              'DNS',
              'TCP',
              'SSL',
              'Request',
              'Response',
              'Processing',
              'Load'
            ],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Paint Timing (95th)">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: [metricPrefix + 'fp'],
            labels: ['First paint'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
