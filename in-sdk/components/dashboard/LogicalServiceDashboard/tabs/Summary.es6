import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import SnapshotLabel from 'in-sdk/components/dashboard/summary/SnapshotLabel';
import { number, seconds, millis } from 'in-services/formatters/number';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import Kpi from 'in-sdk/components/dashboard/summary/Kpi';
import { getLabel } from 'in-sdk/snapshot';
import Button from 'in-components/Button';
import Chart from 'in-components/Chart';

export default function Summary({ snapshot, timeframe, pageName }) {
  const snapshotId = snapshot.get('id');
  let viewTracesQuery = `entity.service.name:"${luceneEscapeString(getLabel(snapshot))}"`;
  const viewTracesButton = (
    <Button kind="secondary" size="sm" href$={getTraceViewLinkWithQuery(viewTracesQuery)}>
      Traces
    </Button>
  );

  return (
    <MaxWidthFullscreenContainer>
      <SnapshotLabel actions={[viewTracesButton]}>{pageName ? pageName : getLabel(snapshot)}</SnapshotLabel>

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
          formatter={seconds.fromMillisFixedDetailed}
        />
        <Kpi
          label="Latency (95th)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`duration.95th`}
          timeWindowAggregation="mean"
          formatter={seconds.fromMillisFixedDetailed}
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
            formatter: number.fixedCompact,
            metrics: ['count', 'error_rate'],
            labels: ['Calls', 'Errors'],
            type: 'countErrorBar',
            aggregation: 'sum'
          }}
          y2={{
            min: 0,
            formatter: millis.detailed,
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
