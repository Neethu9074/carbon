/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number } from 'in-services/formatters/number';

export default function AwsEcMemcachedDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Hashing">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['bytes_used_for_hash'],
            labels: ['Bytes Used For Hash'],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Config Commands">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cmd_config_get', 'cmd_config_set', 'cmd_touch'],
            labels: ['Config Get', 'Config Set', 'Touch'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Commands">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cmd_touch'],
            labels: ['Touch'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Eviction">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['evicted_unfetched', 'expired_unfetched'],
            labels: ['Evicted Unfetched', 'Expired Unfetched'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Touch">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['touch_hits', 'touch_misses'],
            labels: ['Touch hits', 'Touch misses'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Slabs Moved">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['slabs_moved'],
            labels: ['Slabs moved'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
