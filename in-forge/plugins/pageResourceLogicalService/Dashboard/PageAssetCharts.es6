import React from 'react';

import { msZeroDecimalPlaces, msTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

export default function PageAssetCharts({ snapshotId, timeframe, prefix = '' }) {
  return (
    <div>
      <DashboardSection title="Requests/s vs. Average Latency">
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
            metrics: [prefix + 'count'],
            labels: ['requests/s'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: [prefix + 'duration.mean'],
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
              prefix + 'duration.min',
              prefix + 'duration.25th',
              prefix + 'duration.50th',
              prefix + 'duration.75th',
              prefix + 'duration.95th',
              prefix + 'duration.98th',
              prefix + 'duration.99th',
              prefix + 'duration.max'
            ],
            labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
            type: 'integral'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Asset Caching">
        <p>
          Detailed information about in-browser assets and specifically about caching is not available in all {' '}
          web browsers. For this reason, this chart will only represent a subset of all the asset requests. More {' '}
          information is available through the {' '}
          <a href="https://www.w3.org/TR/resource-timing-2/" target="_blank" rel="noopener noreferrer">
            resource timing level 2 specification
          </a>
          {' '}
          and the
          {' '}
          <a href="https://www.w3.org/TR/resource-timing-2/" target="_blank" rel="noopener noreferrer">
            browser support matrix
          </a>.
        </p>

        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: [prefix + 'cachedCount', prefix + 'validatedCount', prefix + 'fullLoadCount'],
            labels: [
              'Assets served from browser cache',
              'Cached asset states validated via request',
              'Full asset loads'
            ],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </div>
  );
}
