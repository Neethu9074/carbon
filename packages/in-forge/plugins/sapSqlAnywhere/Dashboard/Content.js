import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';
import DashboardSection from '../../../../in-sdk/components/dashboard/DashboardSection';
import Chart from '../../../../in-components/Chart/InfrastructureMetricChartBehavior';
import { bytesTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import DatabasesTable from '../../sapSqlAnywhere/Dashboard/DatabasesTable';

export default function SapSqlAnywhereDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['connCount'],
            labels: ['User Connections'],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>

      <DashboardSection title="Disk Reads &amp; Writes">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['diskRead', 'diskWrite'],
            labels: ['Reads', 'Writes'],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>

      <DashboardSection title="Bytes Received &amp; Sent">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['bytesReceived', 'bytesSent'],
            labels: ['Received', 'Sent'],
            type: 'line',
            formatter: bytesTwoDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces
          }}
        />
      </DashboardSection>

      <DashboardSection title="Thread Dead Locks Avoided &amp; Reported">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['threadDeadLocksAvoided', 'threadDeadLocksReported'],
            labels: ['Avoided', 'Reported'],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>

      <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
