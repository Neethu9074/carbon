/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
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
