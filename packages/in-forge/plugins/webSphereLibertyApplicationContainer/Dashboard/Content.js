/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import ConnectionPoolsTable from './ConnectionPoolsTable';
import ServletsTable from './ServletsTable';
import SessionsTable from './SessionsTable';

export default function WebSphereDashboard({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const monitorFeatureEnabled = data.get('monitorFeatureEnabled');
  const threadPoolStatsPresent = data.get('threadPool.threadPoolStatsPresent');
  if (!monitorFeatureEnabled) {
    return (
      <DashboardNotification type="info">
        It seems that monitor feature is not enabled. Please add monitor-1.0 feature in server.xml
      </DashboardNotification>
    );
  }

  return (
    <div>
      {threadPoolStatsPresent ? (
        <DashboardSection title="Thread Pool">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['threadPool.activeThreads', 'threadPool.poolSize'],
              labels: ['Active Threads', 'Pool Size'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : (
        <DashboardNotification type="info">
          Thread Pool stats are not available. There is a known problem when JMS features (WASJmsClient-1.1 and
          WASJmsServer-1.0) are enabled along with the monitor-1.0 feature in server.xml. Thread Pool stats mbean is
          overridden and not visible.
        </DashboardNotification>
      )}
      <ServletsTable snapshot={snapshot} timeConfig={timeConfig} />
      <ConnectionPoolsTable snapshot={snapshot} timeConfig={timeConfig} />
      <SessionsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
