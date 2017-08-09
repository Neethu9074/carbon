import React from 'react';

import PageLoadBreakdownChart from 'in-forge/plugins/browserLogicalService/Dashboard/new/components/PageLoadBreakdownChart';
import { twoDecimalPlaces, msTwoDecimalPlaces, number } from 'in-services/formatters/number';
import DashboardTile from 'in-components/Dashboard/components/DashboardTile';
import Chart from 'in-components/Chart';

export default function Speed({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardTile title="Page Load Breakdown">
        <PageLoadBreakdownChart snapshotId={snapshotId} timeframe={timeframe} />
      </DashboardTile>

      <DashboardTile title="Views vs Load Time">
        <Chart
          snapshotId={snapshotId}
          margins={{
            left: 40,
            right: 40
          }}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['count'],
            labels: ['views'],
            type: 'bar',
            aggregation: 'sum',
            minPixelPerBlock: 5,
            maxDataPoints: 100
          }}
          y2={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['duration.mean'],
            labels: ['load time'],
            type: 'discreteLine',
            aggregation: 'mean',
            minPixelPerBlock: 5,
            maxDataPoints: 100
          }}
        />
      </DashboardTile>

      <DashboardTile title="Page Load Time">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          height={200}
          margins={{
            left: 40
          }}
          y1={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: [
              'duration.50th',
              'duration.75th',
              'duration.90th',
              'duration.95th',
              'duration.98th',
              'duration.99th'
            ],
            labels: ['50th', '75th', '90th', '95th', '98th', '99th'],
            type: 'integral'
          }}
        />
      </DashboardTile>
      <DashboardTile title="Page Load Breakdown">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 40
          }}
          y1={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: ['unl', 'red', 'apc', 'dns', 'tcp', 'ssl', 'req', 'rsp', 'dom', 'chi'],
            labels: ['Unload', 'Redirect', 'AppCache', 'DNS', 'TCP', 'SSL', 'Request', 'Response', 'DOM', 'Children'],
            type: 'stackedArea'
          }}
        />
      </DashboardTile>

      <DashboardTile title="Paint Timing">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: msTwoDecimalPlaces,
            metrics: ['fp'],
            labels: ['First paint'],
            type: 'line'
          }}
        />
      </DashboardTile>
    </div>
  );
}
