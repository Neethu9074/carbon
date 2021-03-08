/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
        {t('in-forge:plugins.webSphereLibertyAppContainer.infoMonitorFeatureNotEnabled')}
      </DashboardNotification>
    );
  }

  return (
    <div>
      {threadPoolStatsPresent ? (
        <DashboardSection title={t('in-forge:plugins.webSphereLibertyAppContainer.titleThreadPool')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['threadPool.activeThreads', 'threadPool.poolSize'],
              labels: [
                t('in-forge:plugins.webSphereLibertyAppContainer.labelActiveThreads'),
                t('in-forge:plugins.webSphereLibertyAppContainer.labelPoolSize')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : (
        <DashboardNotification type="info">
          {t('in-forge:plugins.webSphereLibertyAppContainer.infoThreadPoolStatesNotAvailable')}
        </DashboardNotification>
      )}
      <ServletsTable snapshot={snapshot} timeConfig={timeConfig} />
      <ConnectionPoolsTable snapshot={snapshot} timeConfig={timeConfig} />
      <SessionsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
