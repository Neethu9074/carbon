import React from 'react';

import ConnectionInformation from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Connections/ConnectionInformation';
import { msZeroDecimalPlaces, msTwoDecimalPlaces, number } from 'in-services/formatters/number';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

import './ConnectionSummary.less';

const block = 'in-service-connection-dashboard';

export default connectTo(
  props => {
    return {
      snapshot: getSnapshot(props.snapshotId)
    };
  },
  function ConnectionSummary({ snapshot, timeframe }) {
    if (!snapshot) {
      return (
        <MaxWidthFullscreenContainer>
          <LoadingIndicator type="dark" />
        </MaxWidthFullscreenContainer>
      );
    }

    const backButtonPath = `/connections`;

    const snapshotId = snapshot.get('id');
    let viewTracesQuery = `entity.service.name:"${luceneEscapeString(getLabel(snapshot))}"`;

    return (
      <MaxWidthFullscreenContainer>
        <div className={`${block}__heading`}>
          <BackButton label="Back to connection list" href$={getSubDashboardLink(backButtonPath)} />
          <Button kind="secondary" size="sm" href$={getTraceViewLinkWithQuery(viewTracesQuery)}>
            Traces
          </Button>
        </div>

        <ConnectionInformation snapshot={snapshot} />

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
              formatter: msTwoDecimalPlaces,
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
