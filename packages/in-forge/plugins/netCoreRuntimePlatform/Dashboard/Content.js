/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function NetCoreDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.netCoreRuntimePlatform.exceptions')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['metrics.exceptionThrownCount'],
            labels: [t('in-forge:plugins.netCoreRuntimePlatform.exceptionsThrown')],
            type: 'point',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.netCoreRuntimePlatform.contentions')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['metrics.contentionCount'],
            labels: [t('in-forge:plugins.netCoreRuntimePlatform.contentions')],
            type: 'point',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.netCoreRuntimePlatform.garbageCollection')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['metrics.heapSizeGen0', 'metrics.heapSizeGen1', 'metrics.heapSizeGen2', 'metrics.heapSizeGen3'],
            labels: ['Generation 0', 'Generation 1', 'Generation 2', 'Generation 3'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['metrics.gcCount'],
            labels: [t('in-forge:plugins.netCoreRuntimePlatform.gcCount')],
            type: 'point',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
