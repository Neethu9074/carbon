import React from 'react';

import ErrorOverviewTable from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Errors/ErrorOverviewTable';
import DashboardTile from 'in-components/Dashboard/components/DashboardTile';
import { number } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

export default function ErrorOverview(props) {
  const { snapshot, timeframe } = props;

  return (
    <div>
      <DashboardTile title="Uncaught Errors Over Time">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 60
          }}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['uncaughtErrors'],
            labels: ['Uncaught errors'],
            type: 'bar',
            aggregation: 'sum'
          }}
        />
      </DashboardTile>
      <ErrorOverviewTable {...props} />
    </div>
  );
}
