/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  bytesTwoDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function GardenDashboard({ snapshot, timeConfig }) {
  const cpuLimit = snapshot.getIn(['data', 'cpu.limit']);
  const memoryLimit = snapshot.getIn(['data', 'memory.limit']);
  const diskLimitSoft = snapshot.getIn(['data', 'disk.byteSoft']);
  const diskLimitHard = snapshot.getIn(['data', 'disk.byteHard']);
  const diskLimit =
    diskLimitSoft || diskLimitHard
      ? t('in-forge:plugins.garden.dashboard.diskUsageLimit', {
          diskLimit:
            (diskLimitSoft ? bytesTwoDecimalPlaces(diskLimitSoft) : '') +
            (diskLimitHard ? ' / ' + bytesTwoDecimalPlaces(diskLimitHard) : '')
        })
      : t('in-forge:plugins.garden.dashboard.diskUsage');

  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.garden.dashboard.cpuTotal')}>
          <MetricValue snapshotId={snapshotId} metric="cpu.total" formatter={percentageZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.garden.dashboard.memoryUsage')}>
          <MetricValue snapshotId={snapshotId} metric="memory.usage" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection
        title={
          cpuLimit
            ? t('in-forge:plugins.garden.dashboard.cpuLimit', { cpuLimit: cpuLimit })
            : t('in-forge:plugins.garden.dashboard.cpu')
        }
      >
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpu.total', 'cpu.system', 'cpu.user'],
            labels: [
              t('in-forge:plugins.garden.dashboard.total'),
              t('in-forge:plugins.garden.dashboard.kernel'),
              t('in-forge:plugins.garden.dashboard.user')
            ],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection
        title={
          memoryLimit
            ? t('in-forge:plugins.garden.dashboard.memoryLimit', { memoryLimit: bytesTwoDecimalPlaces(memoryLimit) })
            : t('in-forge:plugins.garden.dashboard.memory')
        }
      >
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: memoryLimit,
            metrics: ['memory.usage', 'memory.total_rss', 'memory.total_cache'],
            labels: [
              t('in-forge:plugins.garden.dashboard.usage'),
              t('in-forge:plugins.garden.dashboard.rss'),
              t('in-forge:plugins.garden.dashboard.cache')
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
              t('in-forge:plugins.garden.dashboard.activeAnonymous'),
              t('in-forge:plugins.garden.dashboard.activeCache'),
              t('in-forge:plugins.garden.dashboard.inactiveAnonymous'),
              t('in-forge:plugins.garden.dashboard.inactiveCache')
            ],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={diskLimit}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: diskLimitHard,
            metrics: [
              'disk.totalBytesUsed',
              'disk.totalInodesUsed',
              'disk.exclusiveBytesUsed',
              'disk.exclusiveInodesUsed'
            ],
            labels: [
              t('in-forge:plugins.garden.dashboard.totalBytes'),
              t('in-forge:plugins.garden.dashboard.totalInodes'),
              t('in-forge:plugins.garden.dashboard.exclusiveBytes'),
              t('in-forge:plugins.garden.dashboard.exclusiveInodes')
            ],
            type: 'line',
            formatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.garden.dashboard.network')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['network.rxBytes', 'network.txBytes'],
            labels: [
              t('in-forge:plugins.garden.dashboard.received'),
              t('in-forge:plugins.garden.dashboard.transmitted')
            ],
            type: 'line',
            formatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
