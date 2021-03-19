/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  kiloBytesZeroDecimalPlaces
} from 'in-services/formatters/number';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage, bytes } from 'in-services/formatters/number';
import CpuTable from 'in-forge/plugins/iBMVSI/Dashboard/CpuTable';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function iBMVSIDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.iBMVSI.labelAverageCPUUsedPercent')}>
          <MetricValue snapshotId={snapshotId} metric="average_cpu_usage_percentage" formatter={percentage.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.iBMVSI.labelMemoryUsedPercent')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="memory.memory_usage_percentage"
            formatter={percentage.detailed}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.iBMVSI.labelNetworkTraffic')}>
          <MetricValue snapshotId={snapshotId} metric="network.network_in_bytes" formatter={bytes.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.iBMVSI.labelVolumeUsed')}>
          <MetricValue snapshotId={snapshotId} metric="volume.volume_read_bytes" formatter={bytes.detailed} />
        </KpiKeyValue>
      </KpiSection>

      <CpuTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title={t('in-forge:plugins.iBMVSI.titleMemory')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: kiloBytesZeroDecimalPlaces,
            tooltipFormatter: kiloBytesZeroDecimalPlaces,
            metrics: ['memory.memory_free_kib', 'memory.memory_used_kib', 'memory.memory_total_kib'],
            labels: [
              t('in-forge:plugins.iBMVSI.labelFree'),
              t('in-forge:plugins.iBMVSI.labelUsed'),
              t('in-forge:plugins.iBMVSI.labelTotal')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.iBMVSI.titleNetwork')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['network.network_in_bytes', 'network.network_out_bytes'],
            labels: [t('in-forge:plugins.iBMVSI.labelBytesIn'), t('in-forge:plugins.iBMVSI.labelBytesOut')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.iBMVSI.titleVolumeAccessSize')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['volume.volume_read_bytes', 'volume.volume_write_bytes'],
            labels: [t('in-forge:plugins.iBMVSI.labelReadBytes'), t('in-forge:plugins.iBMVSI.labelWriteBytes')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.iBMVSI.titleVolumeAccessRequest')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['volume.volume_read_requests', 'volume.volume_write_requests'],
            labels: [t('in-forge:plugins.iBMVSI.labelReadCount'), t('in-forge:plugins.iBMVSI.labelWriteCount')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
