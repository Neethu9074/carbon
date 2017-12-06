import React from 'react';

import { msTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import Chart from 'in-components/Chart';

export default function PageCharts({ snapshotId, timeframe, metricPrefix = '' }) {
  return (
    <div>
      <Columize>
        <DashboardSection title="Views">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              min: 0,
              formatter: twoDecimalPlaces,
              metrics: [metricPrefix + 'count'],
              labels: ['views'],
              type: 'bar',
              aggregation: 'sum'
            }}
          />
        </DashboardSection>

        <DashboardSection title="XHR / AJAX">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
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
      </Columize>

      <DashboardSection title="Errors">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: [metricPrefix + 'uncaughtErrors'],
            labels: ['Errors'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Page Load Time">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          height={200}
          y1={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: [
              metricPrefix + 'duration.50th',
              metricPrefix + 'duration.75th',
              metricPrefix + 'duration.90th',
              metricPrefix + 'duration.95th',
              metricPrefix + 'duration.98th',
              metricPrefix + 'duration.99th'
            ],
            labels: ['50th', '75th', '90th', '95th', '98th', '99th'],
            type: 'integral'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Page Load Breakdown">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
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
              metricPrefix + 'dom',
              metricPrefix + 'chi'
            ],
            labels: ['Unload', 'Redirect', 'AppCache', 'DNS', 'TCP', 'SSL', 'Request', 'Response', 'DOM', 'Children'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Paint Timing">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
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
