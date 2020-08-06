import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default function IBMMQQueueUsageDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title="Open Inputs/Outputs">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`openInputs`, `openOutputs`],
            labels: ['Open Inputs', 'Open Outputs'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
