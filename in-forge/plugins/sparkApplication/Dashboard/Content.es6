import React from 'react';

import { msZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import DashboardNotification from 'in-components/DashboardNotification';

export default function Dashboard({ snapshot, timeframe }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type="info">
        {sensorConnectionStatus}
      </DashboardNotification>
    );
  }
  const streamingApp = snapshot.getIn(['data', 'streamingApp'], true);
  if (streamingApp) {
    return (
      <div>
        <DashboardSection title="Jobs">
          <ChartWithLegend
            snapshotId={snapshot.get('id')}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['finishedJobs'],
              labels: ['Finished Jobs'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Streaming">
          <ChartWithLegend
            snapshotId={snapshot.get('id')}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              formatter: msZeroDecimalPlaces,
              metrics: ['schedulingDelay', 'totalDelay'],
              labels: ['Scheduling Delay', 'Total Delay'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </div>
    );
  } else {
    return (
      <DashboardSection title="Stages">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['waitingStages'],
            labels: ['Waiting Stages'],
            type: 'line'
          }}
        />
      </DashboardSection>
    );
  }
}
