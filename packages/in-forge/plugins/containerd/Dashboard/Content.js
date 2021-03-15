/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  bytesTwoDecimalPlaces,
  timeByNanoTwoDecimalPlaces,
  number,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ContainerdDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.containerd.dashboard.labelCPUTotal')}>
          <MetricValue snapshotId={snapshotId} metric="cpu.total_usage" formatter={percentageZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.containerd.dashboard.labelMemoryUsage')}>
          <MetricValue snapshotId={snapshotId} metric="memory.usage" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.containerd.dashboard.titleCPUTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpu.total_usage', 'cpu.system_usage', 'cpu.user_usage'],
            labels: [
              t('in-forge:plugins.containerd.dashboard.labelTotalTime'),
              t('in-forge:plugins.containerd.dashboard.labelKernelTime'),
              t('in-forge:plugins.containerd.dashboard.labelUserTime')
            ],
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
            metrics: ['cpu.throttling_count'],
            labels: [t('in-forge:plugins.containerd.dashboard.labelThrottlingCount')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['cpu.throttling_time'],
            labels: [t('in-forge:plugins.containerd.dashboard.labelThrottlingTime')],
            type: 'line',
            formatter: timeByNanoTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.containerd.dashboard.titleMemory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['memory.usage', 'memory.total_rss', 'memory.total_cache'],
            labels: [
              t('in-forge:plugins.containerd.dashboard.labelUsage'),
              t('in-forge:plugins.containerd.dashboard.labelRSS'),
              t('in-forge:plugins.containerd.dashboard.labelCache')
            ],
            formatter: bytesTwoDecimalPlaces,
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
            labels: [
              t('in-forge:plugins.containerd.dashboard.labelActiveAnonymous'),
              t('in-forge:plugins.containerd.dashboard.labelActiveCache'),
              t('in-forge:plugins.containerd.dashboard.labelInactiveAnonymous'),
              t('in-forge:plugins.containerd.dashboard.labelInactiveCache')
            ],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
