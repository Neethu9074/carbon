/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';
import WebAppsTable from './WebAppsTable.js';
import { t, Trans } from 'in-i18n';

export default function JettyDashboard({ snapshot, timeConfig }) {
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type="info">
        <Trans i18nKey="in-forge:plugins.jettyApplicationContainer.jmxModuleIsNotEnabledInJetty" />
      </DashboardNotification>
    );
  }

  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.jettyApplicationContainer.idleThreads')}>
          <MetricValue snapshotId={snapshotId} metric="idleThreads" />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.jettyApplicationContainer.totalThreads')}>
          <MetricValue snapshotId={snapshotId} metric="threads" />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.jettyApplicationContainer.queuedThreadPoolStats')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['idleThreads', 'busyThreads', 'threads', 'threadsQueueSize'],
            labels: [
              t('in-forge:plugins.jettyApplicationContainer.idleThreads'),
              t('in-forge:plugins.jettyApplicationContainer.busyThreads'),
              t('in-forge:plugins.jettyApplicationContainer.totalThreads'),
              t('in-forge:plugins.jettyApplicationContainer.threadsQueueSize')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <WebAppsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
