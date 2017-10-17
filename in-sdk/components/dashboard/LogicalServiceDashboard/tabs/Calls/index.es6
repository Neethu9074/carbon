import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { instanaInternalFeaturesEnabled } from 'in-services/featureFlags';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { number, millis } from 'in-services/formatters/number';
import mockup from './time-distribution.png';
import Chart from 'in-components/Chart';

export default function Calls({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <MaxWidthFullscreenContainer>
      <DashboardTile title="Calls vs. Latency">
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
            metrics: ['count', 'error_rate'],
            labels: ['Calls', 'Errors'],
            type: 'countErrorBar',
            aggregation: 'sum'
          }}
          y2={{
            min: 0,
            formatter: millis.fixedCompact,
            metrics: ['duration.mean'],
            labels: ['latency'],
            type: 'line',
            aggregation: 'mean'
          }}
        />
      </DashboardTile>

      <DashboardTile title="Latency Overview">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          height={200}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: millis.fixedCompact,
            tooltipFormatter: millis.fixedDetailed,
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
      </DashboardTile>

      {instanaInternalFeaturesEnabled ? (
        <DashboardTile title="Load Time Distribution">
          <p>
            <strong style={{ color: 'darkred' }}>
              This is a mockup which is only visible internally. We should really have this! In order to get this, we
              need a new way of analyzing durations and calculating distributions.
            </strong>
          </p>
          <img src={mockup} style={{ height: '200px' }} />
        </DashboardTile>
      ) : null}
    </MaxWidthFullscreenContainer>
  );
}
