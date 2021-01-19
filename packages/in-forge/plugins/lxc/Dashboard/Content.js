/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { number, bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import FilesystemsTable from 'in-forge/plugins/lxc/Dashboard/FilesystemsTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';

export default function LxcDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const networkInterface = snapshot.getIn(['data', 'networkInterface']);

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Memory Usage">
          <MetricValue snapshotId={snapshotId} metric="memory.usage" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="CPU">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpu.system_usage', 'cpu.user_usage'],
            labels: ['Kernel', 'User'],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['memory.usage', 'memory.rss', 'memory.cache', 'memory.swap'],
            labels: ['Usage', 'RSS', 'Cache', 'Swap'],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['memory.usedPercentage', 'memory.swapPercentage'],
            labels: ['Used', 'Swap'],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['memory.active_anon', 'memory.active_file', 'memory.inactive_anon', 'memory.inactive_file'],
            labels: ['Active anonymous', 'Active cache', 'Inactive anonymous', 'Inactive cache'],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={`Network ${networkInterface ? '(' + networkInterface + ')' : ''}`}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesTwoDecimalPlaces,
            metrics: ['network.rxBytes', 'network.txBytes'],
            labels: ['RX Bytes', 'TX Bytes'],
            type: 'line'
          }}
          y2={{
            min: 0,
            max: 1,
            metrics: ['network.rxPackets', 'network.txPackets'],
            labels: ['RX Packets', 'TX Packets'],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <FilesystemsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
