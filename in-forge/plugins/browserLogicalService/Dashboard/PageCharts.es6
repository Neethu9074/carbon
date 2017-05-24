import React from 'react';

import { msTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import ChartWithLegend from 'in-components/ChartWithLegend';

export default function PageCharts({ snapshotId, timeframe, metricPrefix = '' }) {
  return (
    <div>
      <TwoColumnRow>
        <DashboardSection title="Calls/s">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              formatter: twoDecimalPlaces,
              metrics: [metricPrefix + 'count'],
              labels: ['calls/s'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="XHR / AJAX">
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
        <ChartWithLegend
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
        <ChartWithLegend
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
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: [
              metricPrefix + 'unl.95th',
              metricPrefix + 'red.95th',
              metricPrefix + 'apc.95th',
              metricPrefix + 'dns.95th',
              metricPrefix + 'tcp.95th',
              metricPrefix + 'req.95th',
              metricPrefix + 'rsp.95th',
              metricPrefix + 'pro.95th',
              metricPrefix + 'loa.95th'
            ],
            labels: ['Unload', 'Redirect', 'AppCache', 'DNS', 'TCP', 'Request', 'Response', 'Processing', 'Load'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Time to First Paint (95th)">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: [metricPrefix + 'fp.95th'],
            labels: ['First paint time'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
