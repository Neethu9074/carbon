import React from 'react';

import TwoColumnDetailHeader from 'in-sdk/components/dashboard/TabView/TwoColumnDetailHeader';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import { number, millis } from 'in-services/formatters/number';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import Kpi from 'in-sdk/components/dashboard/summary/Kpi';
import { getLabel } from 'in-sdk/snapshot';
import Button from 'in-components/Button';

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

      <DashboardTile title="Summary">Summary for {endpoint}</DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}
