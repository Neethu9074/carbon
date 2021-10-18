/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function PingDashboard({ snapshot, timeConfig }) {
  return (
    <DashboardSection title={t('in-forge:plugins.ping.dashboard.duration')}>
      <Chart
        snapshotId={snapshot.get('id')}
        timeConfig={timeConfig}
        y1={{
          formatter: millis.fixedCompact,
          metrics: ['duration'],
          labels: [t('in-forge:plugins.ping.dashboard.duration')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </DashboardSection>
  );
}
