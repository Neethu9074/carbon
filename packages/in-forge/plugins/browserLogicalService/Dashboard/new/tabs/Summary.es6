import React from 'react';

import PageLoadBreakdownChart from 'in-forge/plugins/browserLogicalService/Dashboard/new/components/PageLoadBreakdownChart';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { number, seconds, percentage, millis } from 'in-services/formatters/number';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/paths/tracePaths';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import SnapshotLabel from 'in-sdk/components/dashboard/summary/SnapshotLabel';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import Columize from 'in-sdk/components/dashboard/Columize';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import Kpi from 'in-sdk/components/dashboard/summary/Kpi';
import { getLabel } from 'in-sdk/snapshot';
import Button from 'in-components/Button';
import Chart from 'in-components/Chart';

export default function Summary({ snapshot, timeConfig, pageName, metricPrefix }) {
  const snapshotId = snapshot.get('id');
  let viewTracesQuery = `entity.website.label:"${luceneEscapeString(getLabel(snapshot))}"`;
  if (pageName) {
    viewTracesQuery = `${viewTracesQuery} span.website.page:"${luceneEscapeString(pageName)}"`;
  }
  const viewTracesButton = !twoZeroModeEnabled && (
    <Button kind="secondary" size="sm" href$={getTraceViewLinkWithQuery(viewTracesQuery)}>
      Traces
    </Button>
  );

  const spaSummaryChart = snapshot.getIn(['data', 'spaEnabled']) ? (
    <DashboardTile title="SPA Route Views vs Route Transition Time">
      <Chart
        snapshotId={snapshotId}
        y1={{
          min: 0,
          formatter: number.compact,
          metrics: [`${metricPrefix}pt`, `${metricPrefix}ptErrorRate`],
          labels: ['views', 'errors'],
          type: 'countErrorBar',
          aggregation: 'sum'
        }}
        y2={{
          min: 0,
          formatter: millis.detailed,
          metrics: [`${metricPrefix}pt.mean`],
          labels: ['transition time'],
          type: 'line',
          aggregation: 'mean'
        }}
      />
    </DashboardTile>
  ) : null;

  return (
    <MaxWidthFullscreenContainer>
      <SnapshotLabel actions={[viewTracesButton]}>{pageName ? pageName : getLabel(snapshot)}</SnapshotLabel>

      <Kpis>
        <Kpi
          label="Views"
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          metric={`${metricPrefix}count`}
          timeWindowAggregation="sum"
          formatter={number.compact}
        />
        <Kpi
          label="Load Time (mean)"
          snapshotId={snapshotId}
          timeConfig={timeConfig}
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
          timeConfig={timeConfig}
          metric={`${metricPrefix}duration.90th`}
          timeWindowAggregation="mean"
          formatter={seconds.fromMillisFixedDetailed}
        />
        <Kpi
          label="Load Time (95th)"
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          metric={`${metricPrefix}duration.95th`}
          timeWindowAggregation="mean"
          formatter={seconds.fromMillisFixedDetailed}
        />
      </Kpis>

      <DashboardTile title="Views vs Page Load Time">
        <Chart
          snapshotId={snapshotId}
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

      <Columize>
        <DashboardTile title="Page Load Breakdown" href$={getSubDashboardLink('/speed')}>
          <PageLoadBreakdownChart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            onlyRequest
            metricPrefix={metricPrefix}
          />
        </DashboardTile>
        <DashboardTile title="Errors" href$={getSubDashboardLink('/errors')}>
          <Chart
            snapshotId={snapshotId}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [`${metricPrefix}uncaughtErrors`],
              labels: ['Errors'],
              type: 'bar',
              aggregation: 'sum'
            }}
          />
        </DashboardTile>
      </Columize>

      {spaSummaryChart}
    </MaxWidthFullscreenContainer>
  );
}
