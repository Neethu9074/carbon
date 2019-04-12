import React from 'react';

import {
  bytesTwoDecimalPlaces,
  percentagePlainZeroDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

export default function F5Dashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
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
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpuUsed'],
            labels: ['CPU Usage'],
            formatter: percentagePlainZeroDecimalPlaces,
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title="HTTP Requests">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['httpRequests'],
            labels: ['HTTP Requests'],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
