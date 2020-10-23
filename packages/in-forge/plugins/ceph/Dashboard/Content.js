import React from 'react';

import {
  number,
  percentageTwoDecimalPlaces,
  msZeroDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { healthFormatter } from 'in-forge/plugins/ceph/formatters';
import PoolTable from 'in-forge/plugins/ceph/Dashboard/PoolTable';
import MetricValue from 'in-components/MetricValue';

export default function CephDashboard({ snapshot, timeConfig }) {
  const sensorStatusCode = snapshot.getIn(['data', 'sensorStatusCode'], 1);

  if (sensorStatusCode !== 1) {
    return (
      <DashboardNotification type="info">
        Agent could not connect to Ceph cluster, Ceph executable not found. Please set &apos;ceph-executable-path&apos;
        property to the path of Ceph executable in configuration.
      </DashboardNotification>
    );
  }

  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Overall Status">
          <MetricValue snapshotId={snapshotId} metric="overall_status" formatter={healthFormatter} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Monitors">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['num_mons', 'num_active_mons'],
            labels: ['All', 'Active'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="OSD Status">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['num_osds', 'num_up_osds', 'num_in_osds'],
            labels: ['Total', 'Up', 'In'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Latency">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['commit_latency_ms', 'apply_latency_ms'],
            labels: ['Commit', 'Apply'],
            type: 'line',
            formatter: msZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Unhealthy OSDs">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['num_near_full_osds', 'num_full_osds'],
            labels: ['Near full', 'Full'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Placement Groups">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['num_pgs', 'num_active_clean'],
            labels: ['All', 'Active+Clean'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Number Of Pools">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['num_pools'],
            labels: ['Pools'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Number Of Object">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['num_objects'],
            labels: ['Objects'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="IO">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['read_bytes_sec'],
            labels: ['Read'],
            type: 'line',
            formatter: bytesPerSecondZeroDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['write_bytes_sec'],
            labels: ['Write'],
            type: 'line',
            formatter: bytesPerSecondZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="OPS">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['read_op_per_sec'],
            labels: ['Read'],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['write_op_per_sec'],
            labels: ['Write'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Overall capacity usage">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            metrics: ['aggregate_pct_used'],
            labels: ['Capacity'],
            type: 'line',
            formatter: percentageTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <PoolTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
