import React from 'react';

import ErrorOverviewTable from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Errors/ErrorOverviewTable';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { number } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';
import Title from 'in-components/Title';

export default function ErrorOverview(props) {
  const { snapshot, timeframe } = props;

  return (
    <div>
      <Title title="Error Overview" />
      <DashboardTile title="Errors Over Time">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['uncaughtErrors'],
            labels: ['Errors'],
            type: 'bar',
            aggregation: 'sum'
          }}
        />
      </DashboardTile>
      <ErrorOverviewTable {...props} />
    </div>
  );
}
