/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes, millis } from 'in-services/formatters/number';

export default function AzureStorageDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Transactions">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['tr_to'],
            labels: ['Total number of transactions'],
            formatter: number.detailed,
            type: 'bar'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Ingress">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['in_to'],
            labels: ['The total ingress in bytes'],
            formatter: bytes.compact,
            type: 'bar'
          }}
          y2={{
            metrics: ['in_av', 'in_mi', 'in_mx'],
            labels: ['Average', 'Minimum', 'Maximum'],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Egress">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['eg_to'],
            labels: ['The total egress in bytes'],
            formatter: bytes.compact,
            type: 'bar'
          }}
          y2={{
            metrics: ['eg_av', 'eg_mi', 'eg_mx'],
            labels: ['Average', 'Minimum', 'Maximum'],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Server Latency">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sl_av', 'sl_mi', 'sl_mx'],
            labels: ['Average', 'Minimum', 'Maximum'],
            formatter: millis.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="E2E Latency">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['el_av', 'el_mi', 'el_mx'],
            labels: ['Average', 'Minimum', 'Maximum'],
            formatter: millis.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Availability">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['av_av', 'av_mi', 'av_mx'],
            labels: ['Average', 'Minimum', 'Maximum'],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
