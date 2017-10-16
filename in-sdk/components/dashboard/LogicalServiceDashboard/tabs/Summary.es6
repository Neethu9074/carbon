import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import SnapshotLabel from 'in-sdk/components/dashboard/summary/SnapshotLabel';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import { number, millis } from 'in-services/formatters/number';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import Kpi from 'in-sdk/components/dashboard/summary/Kpi';
import { getLabel } from 'in-sdk/snapshot';
import Button from 'in-components/Button';
import Chart from 'in-components/Chart';

export default function Summary({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  let viewTracesQuery = `entity.service.name:"${luceneEscapeString(getLabel(snapshot))}"`;
  const viewTracesButton = (
    <Button kind="secondary" size="sm" href$={getTraceViewLinkWithQuery(viewTracesQuery)}>
      Traces
    </Button>
  );

  return (
    <MaxWidthFullscreenContainer>
      <SnapshotLabel actions={[viewTracesButton]}>getLabel(snapshot)</SnapshotLabel>

      <Kpis>
        <Kpi
          label="Calls"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`count`}
          timeWindowAggregation="sum"
          formatter={number.compact}
        />
        <Kpi
          label="Latency (50th)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`duration.50th`}
          timeWindowAggregation="mean"
          formatter={millis.fixedCompact}
        />
        <Kpi
          label="Latency (95th)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`duration.95th`}
          timeWindowAggregation="mean"
          formatter={millis.fixedCompact}
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
            formatter: millis.fixedCompact,
            metrics: ['duration.mean'],
            labels: ['latency'],
            type: 'line',
            aggregation: 'mean'
          }}
        />
      </DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}
