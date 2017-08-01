import React from 'react';

import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';

import ProcessCompanionMetrics from 'in-sdk/components/dashboard/ProcessCompanionMetrics';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function ProcessDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            formatter: bytesTwoDecimalPlaces,
            metrics: ['mem.virtual', 'mem.resident', 'mem.share'],
            labels: ['Virtual', 'Resident', 'Share'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="CPU Usage">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['cpu.user', 'cpu.sys'],
            labels: ['User', 'System'],
            formatter: percentageZeroDecimalPlaces,
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <ProcessCompanionMetrics snapshotId={snapshotId} />
    </div>
  );
}
