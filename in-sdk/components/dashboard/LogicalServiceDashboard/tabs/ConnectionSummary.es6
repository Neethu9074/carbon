import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import { number, seconds, percentage } from 'in-services/formatters/number';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import Kpi from 'in-sdk/components/dashboard/summary/Kpi';
import Chart from 'in-components/Chart';

export default function Summary({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  const backButtonPath = `/connections`;

  return (
    <MaxWidthFullscreenContainer>
      <BackButton label="Back to error list" href$={getSubDashboardLink(backButtonPath)} />

      <Kpis>
        <Kpi
          label="Views"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`count`}
          timeWindowAggregation="sum"
          formatter={number.compact}
        />
        <Kpi
          label="Load Time (mean)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`duration.mean`}
          timeWindowAggregation="mean"
          formatter={seconds.fromMillisFixedDetailed}
          percentages={[
            {
              label: 'Server',
              metric: `bac`,
              timeWindowAggregation: 'mean',
              formatter: percentage.compact
            },
            {
              label: 'Browser',
              metric: `fro`,
              timeWindowAggregation: 'mean',
              formatter: percentage.compact
            }
          ]}
        />
        <Kpi
          label="Load Time (90th)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`duration.90th`}
          timeWindowAggregation="mean"
          formatter={seconds.fromMillisFixedDetailed}
        />
        <Kpi
          label="Load Time (95th)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`duration.95th`}
          timeWindowAggregation="mean"
          formatter={seconds.fromMillisFixedDetailed}
        />
      </Kpis>

      <DashboardTile title="Views vs Page Load Time">
        <Chart
          snapshotId={snapshotId}
          margins={{
            left: 60,
            right: 60
          }}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['count'],
            labels: ['views'],
            type: 'bar',
            aggregation: 'sum'
          }}
          y2={{
            min: 0,
            formatter: seconds.fromMillisFixedDetailed,
            metrics: ['duration.mean'],
            labels: ['load time'],
            type: 'line',
            aggregation: 'mean'
          }}
        />
      </DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}
