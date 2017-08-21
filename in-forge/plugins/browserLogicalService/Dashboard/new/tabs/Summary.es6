import React from 'react';

import PageLoadBreakdownChart from 'in-forge/plugins/browserLogicalService/Dashboard/new/components/PageLoadBreakdownChart';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import SnapshotLabel from 'in-sdk/components/dashboard/summary/SnapshotLabel';
import DashboardTile from 'in-components/Dashboard/components/DashboardTile';
import { number, seconds, percentage } from 'in-services/formatters/number';
import NoErrorsMessage from 'in-sdk/components/dashboard/NoErrorsMessage';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import LoadingIndicator from 'in-components/LoadingIndicator';
import RenderWithMetric from 'in-components/RenderWithMetric';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import Kpi from 'in-sdk/components/dashboard/summary/Kpi';
import { Row, Col } from 'in-components/Grid';
import { getLabel } from 'in-sdk/snapshot';
import Button from 'in-components/Button';
import Chart from 'in-components/Chart';

export default function Summary({ snapshot, timeframe, pageName }) {
  const snapshotId = snapshot.get('id');
  let viewTracesQuery = `entity.website.label:"${luceneEscapeString(getLabel(snapshot))}"`;
  if (pageName) {
    viewTracesQuery = `${viewTracesQuery} span.endpoint.label:"${luceneEscapeString(pageName)}"`;
  }
  const viewTracesButton = (
    <Button kind="default" size="sm" href$={getTraceViewLinkWithQuery(viewTracesQuery)}>
      View Traces
    </Button>
  );

  const metricPrefix = pageName == null ? '' : `endpoint.${pageName}.`;

  return (
    <MaxWidthFullscreenContainer>
      <SnapshotLabel actions={[viewTracesButton]}>
        {pageName ? pageName : getLabel(snapshot)}
      </SnapshotLabel>

      <Kpis>
        <Kpi
          label="Views"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`${metricPrefix}count`}
          timeWindowAggregation="sum"
          formatter={number.compact}
        />
        <Kpi
          label="Load Time (mean)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`${metricPrefix}duration.mean`}
          timeWindowAggregation="mean"
          formatter={seconds.fromMillisFixedDetailed}
          percentages={[
            {
              label: 'Server',
              metric: `${metricPrefix}bac`,
              timeWindowAggregation: 'mean',
              formatter: percentage.compact
            },
            {
              label: 'Browser',
              metric: `${metricPrefix}fro`,
              timeWindowAggregation: 'mean',
              formatter: percentage.compact
            }
          ]}
        />
        <Kpi
          label="Load Time (90th)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`${metricPrefix}duration.90th`}
          timeWindowAggregation="mean"
          formatter={seconds.fromMillisFixedDetailed}
        />
        <Kpi
          label="Load Time (95th)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`${metricPrefix}duration.95th`}
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
            metrics: [`${metricPrefix}count`],
            labels: ['views'],
            type: 'bar',
            aggregation: 'sum'
          }}
          y2={{
            min: 0,
            formatter: seconds.fromMillisFixedDetailed,
            metrics: [`${metricPrefix}duration.mean`],
            labels: ['load time'],
            type: 'line',
            aggregation: 'mean'
          }}
        />
      </DashboardTile>

      <Row>
        <Col cols={6}>
          <DashboardTile title="Page Load Breakdown" href$={getSubDashboardLink('/speed')}>
            <PageLoadBreakdownChart
              snapshotId={snapshotId}
              timeframe={timeframe}
              onlyRequest
              metricPrefix={metricPrefix}
            />
          </DashboardTile>
        </Col>
        <Col cols={6}>
          <DashboardTile title="Uncaught Errors" href$={getSubDashboardLink('/errors')}>
            <RenderWithMetric
              snapshotId={snapshotId}
              metric={`${metricPrefix}uncaughtErrors`}
              timeframe={timeframe}
              timeWindowAggregation="sum"
              component={UncaughtErrors}
              metricPrefix={metricPrefix}
            />

          </DashboardTile>
        </Col>
      </Row>
    </MaxWidthFullscreenContainer>
  );
}

function UncaughtErrors({ snapshotId, metricValue, metricPrefix }) {
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
        metrics: [`${metricPrefix}uncaughtErrors`],
        labels: ['Uncaught errors'],
        type: 'bar',
        aggregation: 'sum'
      }}
    />
  );
}
