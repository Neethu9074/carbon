/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';

export default function LiferayDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.liferayApplicationContainer.averageTime')}>
          <MetricValue snapshotId={snapshotId} metric="portalStatistics.averageTime" />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.liferayApplicationContainer.requestCount')}>
          <MetricValue snapshotId={snapshotId} metric="portalStatistics.requestCount" />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.liferayApplicationContainer.portalLatencyOverview')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'portalStatistics.averageTime',
              'portalStatistics.maxTime',
              'portalStatistics.minTime',
              'actionRequestStatistics.averageTime',
              'actionRequestStatistics.maxTime',
              'actionRequestStatistics.minTime'
            ],
            labels: [
              t('in-forge:plugins.liferayApplicationContainer.portalAverageTime'),
              t('in-forge:plugins.liferayApplicationContainer.portalMaxTime'),
              t('in-forge:plugins.liferayApplicationContainer.portalMinTime'),
              t('in-forge:plugins.liferayApplicationContainer.actionRequestAverageTime'),
              t('in-forge:plugins.liferayApplicationContainer.actionRequestMaxTime'),
              t('in-forge:plugins.liferayApplicationContainer.actionRequestMinTime')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.liferayApplicationContainer.requests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['portalStatistics.requestCount', 'portalStatistics.successCount', 'portalStatistics.errorCount'],
            labels: [
              t('in-forge:plugins.liferayApplicationContainer.requestCount'),
              t('in-forge:plugins.liferayApplicationContainer.successCount'),
              t('in-forge:plugins.liferayApplicationContainer.errorCount')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
