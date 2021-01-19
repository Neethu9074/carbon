/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { millis } from 'in-services/formatters/number';

export default function PingDashboard({ snapshot, timeConfig }) {
  return (
    <DashboardSection title="Duration">
      <Chart
        snapshotId={snapshot.get('id')}
        timeConfig={timeConfig}
        y1={{
          formatter: millis.fixedCompact,
          metrics: ['duration'],
          labels: ['Duration'],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </DashboardSection>
  );
}
