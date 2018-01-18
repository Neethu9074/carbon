import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function NetCoreDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Exceptions">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['metrics.exceptionThrownCount'],
            labels: ['Exceptions Thrown'],
            type: 'point',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Garbage Collection">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['metrics.heapSizeGen0', 'metrics.heapSizeGen1', 'metrics.heapSizeGen2', 'metrics.heapSizeGen3'],
            labels: ['Generation 0', 'Generation 1', 'Generation 2', 'Generation 3'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['metrics.gcCount'],
            labels: ['GC Count'],
            type: 'point',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
    </div>
  );
}
