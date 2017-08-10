import React from 'react';

import PageLoadBreakdownChart from 'in-forge/plugins/browserLogicalService/Dashboard/new/components/PageLoadBreakdownChart';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import SnapshotLabel from 'in-sdk/components/dashboard/summary/SnapshotLabel';
import DashboardTile from 'in-components/Dashboard/components/DashboardTile';
import { number, seconds, percentage } from 'in-services/formatters/number';
import NoErrorsMessage from 'in-sdk/components/dashboard/NoErrorsMessage';
import LoadingIndicator from 'in-components/LoadingIndicator';
import RenderWithMetric from 'in-components/RenderWithMetric';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import Kpi from 'in-sdk/components/dashboard/summary/Kpi';
import { Row, Col } from 'in-components/Grid';
import Chart from 'in-components/Chart';

const loadTimePercentages = [
  {
    label: 'Server',
    metric: 'bac',
    timeWindowAggregation: 'mean',
    formatter: percentage.compact
  },
  {
    label: 'Browser',
    metric: 'fro',
    timeWindowAggregation: 'mean',
    formatter: percentage.compact
  }
];

export default function Summary({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <MaxWidthFullscreenContainer>
      <SnapshotLabel snapshot={snapshot} />

      <Kpis>
        <Kpi
          label="Views"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric="count"
          timeWindowAggregation="sum"
          formatter={number.compact}
        />
        <Kpi
          label="Load Time (mean)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric="duration.mean"
          timeWindowAggregation="mean"
          formatter={seconds.fromMillisFixedDetailed}
          percentages={loadTimePercentages}
        />
        <Kpi
          label="Load Time (90th)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric="duration.90th"
          timeWindowAggregation="mean"
          formatter={seconds.fromMillisFixedDetailed}
        />
        <Kpi
          label="Load Time (95th)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric="duration.95th"
          timeWindowAggregation="mean"
          formatter={seconds.fromMillisFixedDetailed}
        />
      </Kpis>

      <DashboardTile title="Overview">
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

      <Row>
        <Col cols={6}>
          <DashboardTile title="Page Load Breakdown" href$={getSubDashboardLink('/speed')}>
            <PageLoadBreakdownChart snapshotId={snapshotId} timeframe={timeframe} onlyRequest />
          </DashboardTile>
        </Col>
        <Col cols={6}>
          <DashboardTile title="Uncaught Errors" href$={getSubDashboardLink('/errors')}>
            <RenderWithMetric
              snapshotId={snapshotId}
              metric="uncaughtErrors"
              timeframe={timeframe}
              timeWindowAggregation="sum"
              component={UncaughtErrors}
            />

          </DashboardTile>
        </Col>
      </Row>
    </MaxWidthFullscreenContainer>
  );
}

function UncaughtErrors({ snapshotId, metricValue }) {
  if (metricValue === null) {
    return <LoadingIndicator type="dark" />;
  } else if (metricValue <= 0) {
    return <NoErrorsMessage />;
  }

  return (
    <Chart
      snapshotId={snapshotId}
      margins={{
        left: 60
      }}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: ['uncaughtErrors'],
        labels: ['Uncaught errors'],
        type: 'bar',
        aggregation: 'sum'
      }}
    />
  );
}
