import React from 'react';

import DBmarlinNotificationMessage from 'in-integrations/database/dbmarlin/DBmarlinNotificationMessage';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function MariaDbDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Queries">
          <MetricValue snapshotId={snapshotId} metric="status.QUERIES" />
        </KpiKeyValue>
        <KpiKeyValue label="Client Connections">
          <MetricValue snapshotId={snapshotId} metric="status.THREADS_CONNECTED" />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Clients">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['status.THREADS_CONNECTED', 'status.MAX_USED_CONNECTIONS', 'status.ABORTED_CONNECTS'],
            labels: ['Connections', 'Max used connections', 'Aborted connects'],
            type: 'line',
            formatter: number.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Slow Queries">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['status.SLOW_QUERIES'],
            labels: ['Slow Queries'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Key Access">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['status.KEY_READ_REQUESTS', 'status.KEY_WRITE_REQUESTS'],
            labels: ['Read Requests', 'Write Requests'],
            type: 'line'
          }}
          y2={{
            metrics: ['status.KEY_READS', 'status.KEY_WRITES'],
            labels: ['Reads', 'Writes'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Aria Engine Properties">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['status.ARIA_PAGECACHE_READS', 'status.ARIA_PAGECACHE_WRITES'],
            labels: ['Pagecache Reads', 'Pagecache Writes'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DBmarlinNotificationMessage />
    </div>
  );
}
