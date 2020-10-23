import React from 'react';

import { bytesTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import DatabasesTable from '../Dashboard/DatabasesTable';

export default function SybaseDashboard({ snapshot, timeConfig }) {
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
            metrics: ['stats.connCount'],
            labels: ['User Connections'],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Disk Reads &amp; Writes">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['stats.diskRead', 'stats.diskWrite'],
            labels: ['Reads', 'Writes'],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Bytes Received &amp; Sent">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['stats.bytesReceived', 'stats.bytesSent'],
            labels: ['Received', 'Sent'],
            type: 'line',
            formatter: bytesTwoDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Thread Dead Locks Avoided &amp; Reported">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['stats.threadDeadlocksAvoided', 'stats.threadDeadlocksReported'],
            labels: ['Avoided', 'Reported'],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
