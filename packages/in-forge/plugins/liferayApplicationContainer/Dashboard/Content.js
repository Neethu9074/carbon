/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
        <KpiKeyValue label="Average Time">
          <MetricValue snapshotId={snapshotId} metric="portalStatistics.averageTime" />
        </KpiKeyValue>
        <KpiKeyValue label="Request Count">
          <MetricValue snapshotId={snapshotId} metric="portalStatistics.requestCount" />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Portal Latency Overview">
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
              'Portal Average Time',
              'Portal Max Time',
              'Portal Min Time',
              'Action Request Average Time',
              'Action Request Max Time',
              'Action Request Min Time'
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['portalStatistics.requestCount', 'portalStatistics.successCount', 'portalStatistics.errorCount'],
            labels: ['Request Count', 'Success Count', 'Error Count'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
