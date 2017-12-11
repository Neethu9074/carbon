import React from 'react';

import TwoColumnDetailHeader from 'in-sdk/components/dashboard/TabView/TwoColumnDetailHeader';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/paths/tracePaths';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import { number, millis } from 'in-services/formatters/number';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import Kpi from 'in-sdk/components/dashboard/summary/Kpi';
import { getLabel } from 'in-sdk/snapshot';
import Button from 'in-components/Button';
import Chart from 'in-components/Chart';

export default function EndpointSummary({ snapshot, endpoint, timeframe }) {
  const snapshotId = snapshot.get('id');
  const metricPrefix = `endpoint.${endpoint}.`;
  const viewTracesQuery = `entity.service.name:"${luceneEscapeString(
    getLabel(snapshot)
  )}" span.endpoint.label:"${luceneEscapeString(endpoint)}"`;

  return (
    <MaxWidthFullscreenContainer>
      <TwoColumnDetailHeader
        left={<BackButton label="Back to endpoint list" href$={getSubDashboardLink(`/endpoints`)} />}
        right={
          <Button kind="secondary" size="sm" href$={getTraceViewLinkWithQuery(viewTracesQuery)}>
            Traces
          </Button>
        }
      />

      <Kpis>
        <Kpi
          label="Calls"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`${metricPrefix}count`}
          timeWindowAggregation="sum"
          formatter={number.compact}
          errorPercentage={{
            snapshotId,
            metric: `${metricPrefix}error_rate`,
            timeframe
          }}
        />
        <Kpi
          label="Latency (50th)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`${metricPrefix}duration.50th`}
          timeWindowAggregation="mean"
          formatter={millis.fixedCompact}
        />
        <Kpi
          label="Latency (95th)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`${metricPrefix}duration.95th`}
          timeWindowAggregation="mean"
          formatter={millis.fixedCompact}
        />
      </Kpis>

      <DashboardTile title="Calls vs. Latency">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: [`${metricPrefix}count`, `${metricPrefix}error_rate`],
            labels: ['Calls', 'Errors'],
            type: 'countErrorBar',
            aggregation: 'sum'
          }}
          y2={{
            min: 0,
            formatter: millis.fixedCompact,
            metrics: [`${metricPrefix}duration.mean`],
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
          y1={{
            min: 0,
            formatter: millis.fixedCompact,
            tooltipFormatter: millis.fixedDetailed,
            metrics: [
              `${metricPrefix}duration.min`,
              `${metricPrefix}duration.25th`,
              `${metricPrefix}duration.50th`,
              `${metricPrefix}duration.75th`,
              `${metricPrefix}duration.95th`,
              `${metricPrefix}duration.98th`,
              `${metricPrefix}duration.99th`,
              `${metricPrefix}duration.max`
            ],
            labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
            type: 'integral'
          }}
        />
      </DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}
