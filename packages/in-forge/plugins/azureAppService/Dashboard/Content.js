/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { number, millis, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

export default function AzureAppServiceDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.azureAppService.dashboard.titleResponseTimesAndRequests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['art'],
            labels: [t('in-forge:plugins.azureAppService.dashboard.labelArt')],
            formatter: millis.detailed,
            type: 'line'
          }}
          y2={{
            metrics: ['trs', 'qrs'],
            labels: [
              t('in-forge:plugins.azureAppService.dashboard.labelTrs'),
              t('in-forge:plugins.azureAppService.dashboard.labelQrs')
            ],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureAppService.dashboard.titleHTTPStatusCodes')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['h2x', 'h4x', 'h5x'],
            labels: [
              t('in-forge:plugins.azureAppService.dashboard.labelH2x'),
              t('in-forge:plugins.azureAppService.dashboard.labelH4x'),
              t('in-forge:plugins.azureAppService.dashboard.labelH5x')
            ],
            formatter: number.detailed,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureAppService.dashboard.titleNetwork')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['bts'],
            labels: [t('in-forge:plugins.azureAppService.dashboard.labelBts')],
            formatter: bytesZeroDecimalPlaces,
            type: 'line'
          }}
          y2={{
            metrics: ['btr'],
            labels: [t('in-forge:plugins.azureAppService.dashboard.labelBtr')],
            formatter: bytesZeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureAppService.dashboard.titleGarbageCollection')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['g0c', 'g1c', 'g2c'],
            labels: [
              t('in-forge:plugins.azureAppService.dashboard.labelG0c'),
              t('in-forge:plugins.azureAppService.dashboard.labelG1c'),
              t('in-forge:plugins.azureAppService.dashboard.labelG2c')
            ],
            formatter: number.detailed,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
