import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import Chart from 'in-components/Chart';

import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default function CrystalDashboard({ snapshot, timeframe }) {
  return (
    <div>
      <DashboardSection title="Heap">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 60,
            right: 60
          }}
          y1={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['gc.tb', 'gc.fb'],
            labels: ['Total', 'Free'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
      <TwoColumnRow>
        <DashboardSection title="Threads">
          <ThreadMetrics snapshot={snapshot} timeframe={timeframe} />
        </DashboardSection>
      </TwoColumnRow>
    </div>
  );
}

function ThreadMetrics({ snapshot, timeframe }) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeframe={timeframe}
      margins={{
        left: 60,
        right: 60
      }}
      y1={{
        min: 0,
        formatter: zeroDecimalPlaces,
        metrics: ['thread.count'],
        labels: ['#Thread Count'],
        type: 'line'
      }}
    />
  );
}
