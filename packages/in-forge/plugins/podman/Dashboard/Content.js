/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
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

export default function PodmanDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const memoryLimitBytes = snapshot.getIn(['data', 'memory.limit']);
  const isRootful = snapshot.getIn(['data', 'rootless']) == undefined || !snapshot.getIn(['data', 'rootless']);

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.podman.dashboard.cpuTotal')}>
          <MetricValue snapshotId={snapshotId} metric="cpu.total_usage" formatter={percentageZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.podman.dashboard.memoryUsage')}>
          <MetricValue snapshotId={snapshotId} metric="memory.usage" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.podman.dashboard.memoryUsagePercentage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="memory.used_percentage"
            formatter={percentageZeroDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.podman.dashboard.cpuTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpu.total_usage', 'cpu.system_usage', 'cpu.user_usage'],
            labels: [
              t('in-forge:plugins.podman.dashboard.total'),
              t('in-forge:plugins.podman.dashboard.kernel'),
              t('in-forge:plugins.podman.dashboard.user')
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
            labels: [t('in-forge:plugins.podman.dashboard.throttlingCount')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['cpu.throttling_time'],
            labels: [t('in-forge:plugins.podman.dashboard.throttlingTime')],
            type: 'line',
            formatter: timeByNanoTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection
        title={
          memoryLimitBytes
            ? t('in-forge:plugins.podman.dashboard.memoryLimit', {
                limitBytes: bytesTwoDecimalPlaces(memoryLimitBytes)
              })
            : t('in-forge:plugins.podman.dashboard.memory')
        }
      >
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['memory.usage'],
            labels: [t('in-forge:plugins.podman.dashboard.usage')],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['memory.used_percentage'],
            labels: [t('in-forge:plugins.podman.dashboard.memoryUsage')],
            type: 'line',
            formatter: percentageTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {isRootful && (
        <DashboardSection title={t('in-forge:plugins.podman.dashboard.blockIo')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['blkio.blk_read', 'blkio.blk_write'],
              labels: [t('in-forge:plugins.podman.dashboard.read'), t('in-forge:plugins.podman.dashboard.write')],
              type: 'line',
              formatter: bytesTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
    </div>
  );
}
