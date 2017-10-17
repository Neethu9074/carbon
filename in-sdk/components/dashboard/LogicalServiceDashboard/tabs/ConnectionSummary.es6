import React from 'react';

import ConnectionInformation from 'in-sdk/components/dashboard/LogicalServiceDashboard/components/ConnectionInformation';
import { msTwoDecimalPlaces, number, seconds, percentage } from 'in-services/formatters/number';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import SnapshotLabel from 'in-sdk/components/dashboard/summary/SnapshotLabel';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import Kpi from 'in-sdk/components/dashboard/summary/Kpi';
import { getLabel } from 'in-sdk/snapshot';
import Button from 'in-components/Button';
import Chart from 'in-components/Chart';

export default function ConnectionSummary({ snapshot, timeframe }) {
  const backButtonPath = `/connections`;

  const snapshotId = snapshot.get('id');
  let viewTracesQuery = `entity.service.name:"${luceneEscapeString(getLabel(snapshot))}"`;
  const viewTracesButton = (
    <Button kind="secondary" size="sm" href$={getTraceViewLinkWithQuery(viewTracesQuery)}>
      Traces
    </Button>
  );

  return (
    <MaxWidthFullscreenContainer>
      <BackButton label="Back to error list" href$={getSubDashboardLink(backButtonPath)} />

      <SnapshotLabel actions={[viewTracesButton]}>{getLabel(snapshot)}</SnapshotLabel>

      <Kpis>
        <Kpi
          label="Calls"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric="count"
          timeWindowAggregation="sum"
          formatter={number.compact}
        />
        <Kpi
          label="Latency"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric="duration.mean"
          timeWindowAggregation="mean"
          formatter={seconds.fromMillisFixedDetailed}
        />
        <Kpi
          label="Error Rate"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric="error_rate"
          timeWindowAggregation="mean"
          formatter={percentage.detailed}
        />
      </Kpis>

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
            formatter: msTwoDecimalPlaces,
            metrics: ['duration.mean'],
            labels: ['latency'],
            type: 'line',
            aggregation: 'mean'
          }}
        />
      </DashboardTile>

      <DashboardTile title="Endpoints">
        <ConnectionInformation snapshot={snapshot} />
      </DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}
