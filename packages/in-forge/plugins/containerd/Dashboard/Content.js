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
import { LogsChartInteractionWrapper } from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { CONTAINERD_ID, getValueMatchTagFilter } from 'in-logging/queryBuilder';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import LogsKpiCard from 'in-forge/plugins/docker/Dashboard/LogsKpiCard';
import { loggingEnabled } from 'in-services/featureFlags';
import RestrictedAccessMessage from 'in-components/rbac';
import MetricValue from 'in-components/MetricValue';
import { useHasLogs } from 'in-logging/hooks';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function ContainerdDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const memoryLimitBytes = snapshot.getIn(['data', 'memory.limit']);

  const tagFilterExpression = getValueMatchTagFilter({ name: CONTAINERD_ID, value: snapshot.get('data')?.get('id') });
  const hasLogs = useHasLogs({ tagFilterExpression, timeConfig });

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.containerd.dashboard.labelCPUTotal')}>
          <MetricValue snapshotId={snapshotId} metric="cpu.total_usage" formatter={percentageZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.containerd.dashboard.labelMemoryUsage')}>
          <MetricValue snapshotId={snapshotId} metric="memory.usage" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.containerd.dashboard.memoryUsage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="memory.used_percentage"
            formatter={percentageZeroDecimalPlaces}
          />
        </KpiKeyValue>
        {loggingEnabled && <LogsKpiCard hasLogs={hasLogs} timeConfig={timeConfig} snapshot={snapshot} />}
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
          y2={{
            min: 0,
            metrics: ['cpu.total_normalized_usage_percentage'],
            labels: [t('in-forge:plugins.containerd.dashboard.labelTotalNormalized')],
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
      <DashboardSection
        title={
          memoryLimitBytes
            ? t('in-forge:plugins.containerd.dashboard.memoryLimit', {
                limitBytes: bytesTwoDecimalPlaces(memoryLimitBytes)
              })
            : t('in-forge:plugins.containerd.dashboard.memory')
        }
      >
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
          y2={{
            min: 0,
            metrics: ['memory.used_percentage', 'memory.working_set_usage_percentage'],
            labels: [
              t('in-forge:plugins.containerd.dashboard.memoryUsage'),
              t('in-forge:plugins.containerd.dashboard.labelMemoryWorkingSet')
            ],
            type: 'line',
            formatter: percentageTwoDecimalPlaces
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
      <DashboardSection title={t('in-forge:plugins.containerd.dashboard.blockIo')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['blkio.blk_read', 'blkio.blk_write'],
            labels: [t('in-forge:plugins.containerd.dashboard.read'), t('in-forge:plugins.containerd.dashboard.write')],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {loggingEnabled && role.canViewLogs && (
        <LogsChartInteractionWrapper tagFilterExpression={[tagFilterExpression]} timeConfig={timeConfig} />
      )}
      {loggingEnabled && !role.canViewLogs && (
        <DashboardSection title={t('in-forge:plugins.docker.dashboard.logs')}>
          <RestrictedAccessMessage permission={t('in-stores:permissionCanViewLogsLabel')} />
        </DashboardSection>
      )}
    </div>
  );
}
