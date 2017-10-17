import React from 'react';

import ConnectionInformation from 'in-sdk/components/dashboard/LogicalServiceDashboard/components/ConnectionInformation';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import { msTwoDecimalPlaces, number } from 'in-services/formatters/number';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import { getLabel } from 'in-sdk/snapshot';
import Button from 'in-components/Button';
import Chart from 'in-components/Chart';

import './ConnectionSummary.less';

const block = 'in-service-connection-dashboard';

export default function ConnectionSummary({ snapshot, timeframe }) {
  const backButtonPath = `/connections`;

  const snapshotId = snapshot.get('id');
  let viewTracesQuery = `entity.service.name:"${luceneEscapeString(getLabel(snapshot))}"`;

  return (
    <MaxWidthFullscreenContainer>
      <div className={`${block}__heading`}>
        <BackButton label="Back to error list" href$={getSubDashboardLink(backButtonPath)} />
        <Button kind="secondary" size="sm" href$={getTraceViewLinkWithQuery(viewTracesQuery)}>
          Traces
        </Button>
      </div>

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

      <ConnectionInformation snapshot={snapshot} />
    </MaxWidthFullscreenContainer>
  );
}
