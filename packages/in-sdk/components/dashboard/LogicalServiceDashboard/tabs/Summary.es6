import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/paths/tracePaths';
import SnapshotLabel from 'in-sdk/components/dashboard/summary/SnapshotLabel';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import { number, millis } from 'in-services/formatters/number';
import HealthButton from 'in-components/health/HealthButton';
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
      <SnapshotLabel actions={[viewTracesButton, <HealthButton size="sm" snapshotId={snapshotId} />]}>
        {getLabel(snapshot)}
      </SnapshotLabel>

      <Kpis>
        <Kpi
          label="Calls"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`count`}
          timeWindowAggregation="sum"
          formatter={number.compact}
          errorPercentage={{
            snapshotId,
            metric: 'error_rate',
            timeframe
          }}
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
        <Kpi
          label="Instances (mean)"
          snapshotId={snapshotId}
          timeframe={timeframe}
          metric={`instances`}
          timeWindowAggregation="mean"
          formatter={number.compact}
        />
      </Kpis>

      <DashboardTile title="Calls vs. Latency">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
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
              'duration.min',
              'duration.25th',
              'duration.50th',
              'duration.75th',
              'duration.95th',
              'duration.98th',
              'duration.99th',
              'duration.max'
            ],
            labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
            type: 'integral'
          }}
        />
      </DashboardTile>

      <DashboardTile title="Number of Instances">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['instances'],
            labels: ['Instances'],
            type: 'bar',
            aggregation: 'mean'
          }}
        />
      </DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}
