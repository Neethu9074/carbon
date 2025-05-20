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
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function CrioDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.crio.dashboard.cpuTotal')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="cpu.total_usage"
            formatter={percentageZeroDecimalPlaces}
            minRollup={10000}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.crio.dashboard.memoryUsage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="memory.usage"
            formatter={bytesTwoDecimalPlaces}
            minRollup={10000}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.crio.dashboard.memoryTotalUsagePercentage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="memory.used_percentage"
            formatter={percentageZeroDecimalPlaces}
            minRollup={10000}
          />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.crio.dashboard.cpuTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          minRollup={10000}
          y1={{
            min: 0,
            metrics: ['cpu.total_usage', 'cpu.system_usage', 'cpu.user_usage'],
            labels: [
              t('in-forge:plugins.crio.dashboard.total'),
              t('in-forge:plugins.crio.dashboard.kernel'),
              t('in-forge:plugins.crio.dashboard.user')
            ],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          minRollup={10000}
          y1={{
            min: 0,
            metrics: ['cpu.throttling_count'],
            labels: [t('in-forge:plugins.crio.dashboard.throttlingCount')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['cpu.throttling_time'],
            labels: [t('in-forge:plugins.crio.dashboard.throttlingTime')],
            type: 'line',
            formatter: timeByNanoTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.crio.dashboard.memory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          minRollup={10000}
          y1={{
            min: 0,
            metrics: ['memory.usage', 'memory.total_rss', 'memory.total_cache'],
            labels: [
              t('in-forge:plugins.crio.dashboard.usage'),
              t('in-forge:plugins.crio.dashboard.rss'),
              t('in-forge:plugins.crio.dashboard.cache')
            ],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          minRollup={10000}
          y1={{
            min: 0,
            metrics: ['memory.active_anon', 'memory.active_file', 'memory.inactive_anon', 'memory.inactive_file'],
            labels: [
              t('in-forge:plugins.crio.dashboard.activeAnonymous'),
              t('in-forge:plugins.crio.dashboard.activeCache'),
              t('in-forge:plugins.crio.dashboard.inactiveAnonymous'),
              t('in-forge:plugins.crio.dashboard.inactiveCache')
            ],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          minRollup={10000}
          y1={{
            min: 0,
            metrics: ['memory.total_rss_percent'],
            labels: [t('in-forge:plugins.crio.dashboard.memoryTotalRssPercentage')],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.crio.dashboard.blockIo')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          minRollup={10000}
          y1={{
            min: 0,
            metrics: ['blkio.blk_read', 'blkio.blk_write'],
            labels: [t('in-forge:plugins.crio.dashboard.read'), t('in-forge:plugins.crio.dashboard.write')],
            type: 'line',
            formatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
