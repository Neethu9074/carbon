import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import { zeroDecimalPlaces, bytes } from 'in-services/formatters/number';

export default function Dashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title="Containers">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['runningContainers', 'failedContainers'],
            labels: ['Running Containers', 'Failed Containers'],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['allocatedMem', 'availableMem'],
            labels: ['Allocated Memory', 'Available Memory'],
            formatter: bytes.compact,
            tooltipFormatter: bytes.detailed,
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Virtual Cores">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['allocatedVCores', 'availableVCores'],
            labels: ['Allocated Virtual Cores', 'Available Virtual Cores'],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
