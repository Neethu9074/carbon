import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function NetCoreDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Garbage Collections">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['mem.heapSizeGen0', 'mem.heapSizeGen1', 'mem.heapSizeGen2', 'mem.heapSizeGen3'],
            labels: ['Generation 0', 'Generation 1', 'Generation 2', 'Generation 3'],
            type: 'point',
            formatter: zeroDecimalPlaces
          }} /*
          y2={{
            min: 0,
            max: 100,
            metrics: ['mem.time_in_gc'],
            labels: ['Time spent in GC (%)'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}*/
        />
      </DashboardSection>
    </div>
  );
}
