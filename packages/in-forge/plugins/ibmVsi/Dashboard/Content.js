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
import NetworkTable from 'in-forge/plugins/ibmVsi/Dashboard/NetworkTable';
import CpuTable from 'in-forge/plugins/ibmVsi/Dashboard/CpuTable';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmVsiDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmVsi.labelAverageCPUUsedPercent')}>
          <MetricValue snapshotId={snapshotId} metric="average_cpu_usage_percentage" formatter={percentage.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmVsi.labelMemoryUsedPercent')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="memory.memory_usage_percentage"
            formatter={percentage.detailed}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmVsi.labelNetworkTraffic')}>
          <MetricValue snapshotId={snapshotId} metric="network.network_total_bytes" formatter={bytes.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmVsi.labelVolumeUsed')}>
          <MetricValue snapshotId={snapshotId} metric="volume.volume_total_bytes" formatter={bytes.detailed} />
        </KpiKeyValue>
      </KpiSection>

      <CpuTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title={t('in-forge:plugins.ibmVsi.titleMemory')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: kiloBytesZeroDecimalPlaces,
            tooltipFormatter: kiloBytesZeroDecimalPlaces,
            metrics: ['memory.memory_free_kib', 'memory.memory_used_kib', 'memory.memory_total_kib'],
            labels: [
              t('in-forge:plugins.ibmVsi.labelFree'),
              t('in-forge:plugins.ibmVsi.labelUsed'),
              t('in-forge:plugins.ibmVsi.labelTotal')
            ],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: percentage.detailed,
            metrics: ['memory.memory_usage_percentage'],
            labels: [t('in-forge:plugins.ibmVsi.labelMemoryUsedPercent')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <NetworkTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title={t('in-forge:plugins.ibmVsi.titleVolumeAccessSize')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['volume.volume_read_bytes', 'volume.volume_write_bytes'],
            labels: [t('in-forge:plugins.ibmVsi.labelReadBytes'), t('in-forge:plugins.ibmVsi.labelWriteBytes')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmVsi.titleVolumeAccessRequest')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['volume.volume_read_requests', 'volume.volume_write_requests'],
            labels: [t('in-forge:plugins.ibmVsi.labelReadCount'), t('in-forge:plugins.ibmVsi.labelWriteCount')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
