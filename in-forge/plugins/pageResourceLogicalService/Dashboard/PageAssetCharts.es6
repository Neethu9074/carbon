import React from 'react';

import ResourceCaching from 'in-forge/plugins/pageResourceLogicalService/Dashboard/ResourceCaching';
import { msTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

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
            type: 'line',
            aggregation: 'sum'
          }}
          y2={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: [prefix + 'duration.mean'],
            labels: ['average latency'],
            type: 'line',
            aggregation: 'mean'
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
              prefix + 'duration.50th',
              prefix + 'duration.90th',
              prefix + 'duration.95th',
              prefix + 'duration.98th',
              prefix + 'duration.99th'
            ],
            labels: ['50th', '90th', '95th', '98th', '99th'],
            type: 'integral',
            aggregation: 'mean'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Resource Caching">
        <ResourceCaching snapshotId={snapshotId} timeframe={timeframe} prefix={prefix} />
      </DashboardSection>
    </div>
  );
}
