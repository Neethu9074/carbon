import React from 'react';

import { zeroDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import OperationsTable from 'in-forge/plugins/etcd/Dashboard/OperationsTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Columize from 'in-sdk/components/dashboard/Columize';

export default function EtcdDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  return (
    <div>
      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['requests_received', 'requests_sent'],
            labels: ['Received', 'Sent'],
            formatter: zeroDecimalPlaces,
            type: 'stackedBar',
            aggregation: 'sum'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Traffic">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['bytes_per_sec_received', 'bytes_per_sec_sent'],
            labels: ['Received', 'Sent'],
            formatter: bytesZeroDecimalPlaces,
            type: 'stackedBar',
            aggregation: 'sum'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Storage">
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['storage.expire_count'],
              labels: ['Expire count'],
              formatter: zeroDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['storage.watchers'],
              labels: ['Watchers'],
              formatter: zeroDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>
      <OperationsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
