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
import { t } from 'in-i18n';

export default function ibmcloudVSIDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmcloudVSI.averageCpuUsedPercentage')}>
          <MetricValue snapshotId={snapshotId} metric="average_cpu_usage_percentage" formatter={percentage.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmcloudVSI.memoryUsedPercentage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="memory.memory_usage_percentage"
            formatter={percentage.detailed}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmcloudVSI.networkTrafficBytes')}>
          <MetricValue snapshotId={snapshotId} metric="network.network_in_bytes" formatter={bytes.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmcloudVSI.volumeUsageBytes')}>
          <MetricValue snapshotId={snapshotId} metric="volume.volume_read_bytes" formatter={bytes.detailed} />
        </KpiKeyValue>
      </KpiSection>

      <CpuTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title={t('in-forge:plugins.ibmcloudVSI.memory')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['memory.memory_free_kib', 'memory.memory_used_kib', 'memory.memory_total_kib'],
            labels: [
              t('in-forge:plugins.ibmcloudVSI.free'),
              t('in-forge:plugins.ibmcloudVSI.used'),
              t('in-forge:plugins.ibmcloudVSI.total')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmcloudVSI.network')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['network.network_in_bytes', 'network.network_out_bytes'],
            labels: [t('in-forge:plugins.ibmcloudVSI.bytesIn'), t('in-forge:plugins.ibmcloudVSI.bytesOut')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmcloudVSI.volumeAccessSize')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['volume.volume_read_bytes', 'volume.volume_write_bytes'],
            labels: [t('in-forge:plugins.ibmcloudVSI.bytesRead'), t('in-forge:plugins.ibmcloudVSI.writeBytes')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmcloudVSI.volumeAccessRequest')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['volume.volume_read_requests', 'volume.volume_write_requests'],
            labels: [t('in-forge:plugins.ibmcloudVSI.bytesRead'), t('in-forge:plugins.ibmcloudVSI.writeBytes')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
