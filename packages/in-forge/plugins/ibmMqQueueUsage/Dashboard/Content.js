import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces, number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function IbmMqQueueUsageDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Open Inputs">
          <MetricValue snapshotId={snapshotId} metric="openInputs" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Open Outputs">
          <MetricValue snapshotId={snapshotId} metric="openOutputs" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
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
