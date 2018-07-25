import React from 'react';

import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces, number } from 'in-services/formatters/number';
import ProcessCompanionMetrics from 'in-sdk/components/dashboard/ProcessCompanionMetrics';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function ProcessDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const contextSwitchesEnabled = snapshot.get('ctx_switches_enabled');
  return (
    <div>
      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
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
          timeConfig={timeConfig}
          y1={{
            metrics: ['cpu.user', 'cpu.sys'],
            labels: ['User', 'System'],
            formatter: percentageZeroDecimalPlaces,
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      {contextSwitchesEnabled ? (
        <DashboardSection title="Number of context switches">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['ctx_switches.voluntary', 'ctx_switches.nonvoluntary'],
              labels: ['Voluntary', 'Nonvoluntary'],
              formatter: number.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      ) : null}

      <ProcessCompanionMetrics snapshotId={snapshotId} />
    </div>
  );
}
