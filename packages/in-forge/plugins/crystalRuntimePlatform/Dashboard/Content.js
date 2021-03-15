/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function CrystalDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.crystalRuntimePlatform.dashboard.heap')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            metrics: ['gc.hs', 'gc.fb', 'gc.ub'],
            labels: [
              t('in-forge:plugins.crystalRuntimePlatform.dashboard.size'),
              t('in-forge:plugins.crystalRuntimePlatform.dashboard.free'),
              t('in-forge:plugins.crystalRuntimePlatform.dashboard.unused')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.crystalRuntimePlatform.dashboard.boehmGc')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            metrics: ['gc.bsgc'],
            labels: [t('in-forge:plugins.crystalRuntimePlatform.dashboard.bytesSinceGc')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
