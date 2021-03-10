/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { bytesZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage, bytes } from 'in-services/formatters/number';
import CpuTable from 'in-forge/plugins/ibmcloudVSI/Dashboard/CpuTable';
import MetricValue from 'in-components/MetricValue';

export default function ibmcloudVSIDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Average CPU Used Percentage">
          <MetricValue snapshotId={snapshotId} metric="average_cpu_usage_percentage" formatter={percentage.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Used Percentage">
          <MetricValue snapshotId={snapshotId} metric="memory.memory_usage_percentage" formatter={percentage.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label="Network Traffic(bytes)">
          <MetricValue snapshotId={snapshotId} metric="network.network_in_bytes" formatter={bytes.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label="Volume Usage(bytes)">
          <MetricValue snapshotId={snapshotId} metric="volume.volume_read_bytes" formatter={bytes.detailed} />
        </KpiKeyValue>
      </KpiSection>

      <CpuTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['memory.memory_free_kib', 'memory.memory_used_kib', 'memory.memory_total_kib'],
            labels: ['Free', 'Used', 'Total'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Network">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['network.network_in_bytes', 'network.network_out_bytes'],
            labels: ['Bytes In', 'Bytes out'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Volume Access Size">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['volume.volume_read_bytes', 'volume.volume_write_bytes'],
            labels: ['Bytes Read', 'Write Bytes'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Volume Access Request">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['volume.volume_read_requests', 'volume.volume_write_requests'],
            labels: ['Bytes Read', 'Write Bytes'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

    </div>
  );
}
