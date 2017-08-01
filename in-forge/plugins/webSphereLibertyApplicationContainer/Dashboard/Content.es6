import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

import ConnectionPoolsTable from './ConnectionPoolsTable';
import ServletsTable from './ServletsTable';
import SessionsTable from './SessionsTable';

export default function WebSphereDashboard({ snapshot, timeframe }) {
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
      {threadPoolStatsPresent
        ? <DashboardSection title="Thread Pool">
            <Chart
              snapshotId={snapshot.get('id')}
              timeframe={timeframe}
              margins={{
                left: 80
              }}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: ['threadPool.activeThreads', 'threadPool.poolSize'],
                labels: ['Active Threads', 'Pool Size'],
                type: 'line'
              }}
            />
          </DashboardSection>
        : <DashboardNotification type="info">
            Thread Pool stats are not available. There is a known problem when JMS features (WASJmsClient-1.1 and
            WASJmsServer-1.0) are enabled along with the monitor-1.0 feature in server.xml. Thread Pool stats mbean is
            overridden and not visible.
          </DashboardNotification>}
      <ServletsTable snapshot={snapshot} timeframe={timeframe} />
      <ConnectionPoolsTable snapshot={snapshot} timeframe={timeframe} />
      <SessionsTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
