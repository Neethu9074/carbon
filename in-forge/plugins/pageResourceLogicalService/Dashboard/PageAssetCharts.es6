import React from 'react';

import { msTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import Link from 'in-components/Link';

export default function PageAssetCharts({ snapshotId, timeframe, prefix = '' }) {
  return (
    <div>
      <DashboardSection title="Requests/s vs. Average Latency">
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

      <DashboardSection title="Resource Caching">
        <p>
          Detailed information about in-browser resources and specifically about caching is not available in all {' '}
          web browsers. For this reason, this chart will only represent a subset of all the resource requests. More
          {' '}
          {' '}
          information is available through the {' '}
          <Link href="https://www.w3.org/TR/resource-timing-2/" external>
            resource timing level 2 specification
          </Link>
          {' '}
          and the
          {' '}
          <Link href="https://www.w3.org/TR/resource-timing-2/" external>
            browser support matrix
          </Link>.
        </p>
        <p>
          Access to caching statistics is restricted by the browser for security reasons using the same-origin {' '}
          principle. In order to allow gathering of this information from a variety of domains, ensure that {' '}
          resources are served with a <code>Timing-Allow-Origin: *</code> header.
        </p>

        <Chart
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
              'Resourcess served from browser cache',
              'Cached resource states validated via request',
              'Full resource loads'
            ],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </div>
  );
}
