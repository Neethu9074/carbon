import React from 'react';

import { msZeroDecimalPlaces, msTwoDecimalPlaces, number, millis } from 'in-services/formatters/number';
import TwoColumnDetailHeader from 'in-sdk/components/dashboard/TabView/TwoColumnDetailHeader';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import PhysicalContext from 'in-sdk/components/dashboard/context/PhysicalContext';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import LoadingIndicator from 'in-components/LoadingIndicator';
import HealthButton from 'in-components/health/HealthButton';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import Kpi from 'in-sdk/components/dashboard/summary/Kpi';
import { getSnapshot } from 'in-stores/snapshot';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

export default connectTo(
  props => {
    return {
      snapshot: getSnapshot(props.serviceInstanceId)
    };
  },
  function ServiceInstanceSummary({ snapshot, timeframe }) {
    if (!snapshot) {
      return (
        <MaxWidthFullscreenContainer>
          <LoadingIndicator type="dark" />
        </MaxWidthFullscreenContainer>
      );
    }

    const snapshotId = snapshot.get('id');
    let viewTracesQuery = `trace.touchedServiceInstance:"${luceneEscapeString(snapshotId)}"`;
    return (
      <MaxWidthFullscreenContainer>
        <TwoColumnDetailHeader
          left={<BackButton label="Back to instance list" href$={getSubDashboardLink(`/instances`)} />}
          right={[
            <Button kind="secondary" size="sm" href$={getTraceViewLinkWithQuery(viewTracesQuery)}>
              Traces
            </Button>,
            <HealthButton size="sm" snapshotId={snapshotId} />
          ]}
        />

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
        </Kpis>

        <DashboardTile title="Infrastructure Context">
          <PhysicalContext snapshotId={snapshot.get('id')} />
        </DashboardTile>

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
        <DashboardTile title="Latency Overview">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            height={200}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              formatter: msZeroDecimalPlaces,
              tooltipFormatter: msTwoDecimalPlaces,
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
      </MaxWidthFullscreenContainer>
    );
  }
);
