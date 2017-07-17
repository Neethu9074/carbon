import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';

export default function CrystalDashboard({ snapshot, timeframe }) {
  return (
    <div>
      <DashboardSection title="Heap">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            metrics: ['gc.hs', 'gc.fb', 'gc.ub'],
            labels: ['Size', 'Free', 'Unused'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Boehm GC">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            metrics: ['gc.bsgc'],
            labels: ['Bytes Since GC'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
