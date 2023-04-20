/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { number, kiloBytes, percentagePlainZeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import MetricValue from 'in-components/MetricValue';
import FileSystem from './FileSystem.js';
import { t } from 'in-i18n';

export default function sapApplicationDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.sapHost.cPUSystemUsage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="metrics.Performance.CPU_SYSTEM_UTILIZATION.value"
            formatter={percentagePlainZeroDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.sapHost.totalMemoryUsage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="metrics.Performance.MEMORY_TOTAL_KB.value"
            formatter={kiloBytes.compact}
          />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.sapHost.cPUUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['metrics.Performance.CPU_IO_WAIT.value'],
            labels: [t('in-forge:plugins.sapHost.CPU_IO_WAIT')],
            formatter: number,
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: [
              'metrics.Performance.CPU_SYSTEM_UTILIZATION.value',
              'metrics.Performance.CPU_USER_UTILIZATION.value'
            ],
            labels: [
              t('in-forge:plugins.sapHost.cPU_SYSTEM_UTILIZATION'),
              t('in-forge:plugins.sapHost.cPU_USER_UTILIZATION')
            ],
            formatter: percentagePlainZeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sapHost.memoryUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'metrics.Performance.MEMORY_TOTAL_KB.value',
              'metrics.Performance.MEMORY_FREE_KB.value',
              'metrics.Performance.MEMORY_SWAP_TOTAL_KB.value',
              'metrics.Performance.MEMORY_SWAP_FREE_KB.value',
              'metrics.Performance.MEMORY_PAGE_IN_KB.value',
              'metrics.Performance.MEMORY_PAGE_OUT_KB.value'
            ],
            labels: [
              t('in-forge:plugins.sapHost.mEMORY_TOTAL_KB'),
              t('in-forge:plugins.sapHost.mEMORY_Free_KB'),
              t('in-forge:plugins.sapHost.mEMORY_SWAP_TOTAL_KB'),
              t('in-forge:plugins.sapHost.mEMORY_SWAP_FREE_KB'),
              t('in-forge:plugins.sapHost.mEMORY_PAGE_IN_KB'),
              t('in-forge:plugins.sapHost.mEMORY_PAGE_OUT_KB')
            ],
            formatter: kiloBytes.detailed,
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['metrics.Performance.MEMORY_SWAP_FREE.value', 'metrics.Performance.MEMORY_PAGE_OUT.value'],
            labels: [t('in-forge:plugins.sapHost.mEMORY_SWAP_FREE'), t('in-forge:plugins.sapHost.mEMORY_PAGE_OUT')],
            formatter: percentagePlainZeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sapHost.webServiceAvailability')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['metrics.http.HOST_SAPHOSTAGENT_WDSL.value', 'metrics.http.HOST_SAPOSCOL_WSDL.value'],
            labels: [t('in-forge:plugins.sapHost.agentAvailability'), t('in-forge:plugins.sapHost.oSCOLAvailability')],
            formatter: number,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <FileSystem snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
