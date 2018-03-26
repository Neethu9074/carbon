import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

import AZClassicTable from './AZClassicTable';

export default function AwsElbAppDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="ELB HTTP errors">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['elb_4XX_count', 'elb_5XX_count'],
            labels: ['Status Code 4xx', 'Status Code 5xx'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <AZClassicTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
