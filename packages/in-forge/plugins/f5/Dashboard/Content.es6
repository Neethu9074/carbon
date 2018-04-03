import React from 'react';

import { bytesTwoDecimalPlaces, percentagePlainZeroDecimalPlaces } from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function F5Dashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            max: snapshot.getIn(['data', 'memTotal']),
            formatter: bytesTwoDecimalPlaces,
            metrics: ['memFree'],
            labels: ['Free'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="CPU Usage">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['cpuUsed'],
            labels: ['CPU Usage'],
            formatter: percentagePlainZeroDecimalPlaces,
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </div>
  );
}
