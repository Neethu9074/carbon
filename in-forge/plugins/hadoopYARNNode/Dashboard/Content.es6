import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import DashboardNotification from 'in-components/DashboardNotification';
import { zeroDecimalPlaces, bytes } from 'in-services/formatters/number';

export default function Dashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const healthReport = snapshot.getIn(['data', 'healthReport']);
  return (
    <div>
      {healthReport
        ? <DashboardNotification type="danger">
            <b>Hadoop Health Check Report: </b>{healthReport}
          </DashboardNotification>
        : null}
      <DashboardSection title="Containers">
        <ChartWithLegend
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
        <ChartWithLegend
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
        <ChartWithLegend
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
