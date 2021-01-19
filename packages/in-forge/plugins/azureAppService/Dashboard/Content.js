/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { number, millis, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

export default function AzureAppServiceDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Response Times and Requests">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['art'],
            labels: ['Response Time'],
            formatter: millis.detailed,
            type: 'line'
          }}
          y2={{
            metrics: ['trs', 'qrs'],
            labels: ['Total Requests', 'Queued Requests'],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="HTTP Status Codes">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['h2x', 'h4x', 'h5x'],
            labels: ['HTTP 2xx Responses', 'HTTP 4xx Responses', 'HTTP 5xx Responses'],
            formatter: number.detailed,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Network">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['bts'],
            labels: ['Bytes Sent'],
            formatter: bytesZeroDecimalPlaces,
            type: 'line'
          }}
          y2={{
            metrics: ['btr'],
            labels: ['Bytes Received'],
            formatter: bytesZeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Garbage Collection">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['g0c', 'g1c', 'g2c'],
            labels: ['Generation 0', 'Generation 1', 'Generation 2'],
            formatter: number.detailed,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
