/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import UserSpoolSpaceTable from 'in-forge/plugins/ibmIOs/Dashboard/UserSpoolSpaceTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import OutputQueueTable from 'in-forge/plugins/ibmIOs/Dashboard/OutputQueueTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MemoryPoolsTable from 'in-forge/plugins/ibmIOs/Dashboard/MemoryPoolTable';
import HistoryLogTable from 'in-forge/plugins/ibmIOs/Dashboard/HistoryLogTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import SubsystemTable from 'in-forge/plugins/ibmIOs/Dashboard/SubsystemTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import JobQueueTable from 'in-forge/plugins/ibmIOs/Dashboard/JobQueueTable';
import { number, percentage, bytes } from 'in-services/formatters/number';
import AspTable from 'in-forge/plugins/ibmIOs/Dashboard/AspTable';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmIOsDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmIOs.dashboard.avgCpuUtilization')}>
          <MetricValue snapshotId={snapshotId} metric="avgCPUUtil" formatter={percentage.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmIOs.dashboard.activeJobs')}>
          <MetricValue snapshotId={snapshotId} metric="activeJobs" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmIOs.dashboard.threads')}>
          <MetricValue snapshotId={snapshotId} metric="activeThreads" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.ibmIOs.dashboard.charts.cpu.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['avgCPURate'],
              labels: [t('in-forge:plugins.ibmIOs.dashboard.charts.cpu.rate')],
              formatter: percentage.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmIOs.dashboard.charts.cpuUtilization.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['avgCPUUtil', 'minCPUUtil', 'maxCPUUtil'],
              labels: [
                t('in-forge:plugins.ibmIOs.dashboard.charts.cpuUtilization.avg'),
                t('in-forge:plugins.ibmIOs.dashboard.charts.cpuUtilization.min'),
                t('in-forge:plugins.ibmIOs.dashboard.charts.cpuUtilization.max')
              ],
              formatter: percentage.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.ibmIOs.dashboard.charts.jobs.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['activeJobs', 'interactiveJobs', 'totalJobs', 'maxJobs'],
              labels: [
                t('in-forge:plugins.ibmIOs.dashboard.charts.jobs.active'),
                t('in-forge:plugins.ibmIOs.dashboard.charts.jobs.interactive'),
                t('in-forge:plugins.ibmIOs.dashboard.charts.jobs.total'),
                t('in-forge:plugins.ibmIOs.dashboard.charts.jobs.max')
              ],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmIOs.dashboard.charts.threads.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['activeThreads'],
              labels: [t('in-forge:plugins.ibmIOs.dashboard.charts.threads.active')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.ibmIOs.dashboard.charts.auxiliaryStoragePool.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sysASPUsed'],
              labels: [t('in-forge:plugins.ibmIOs.dashboard.charts.auxiliaryStoragePool.used')],
              formatter: percentage.compact,
              type: 'line'
            }}
            y2={{
              min: 0,
              metrics: ['sysASPStorage'],
              labels: [t('in-forge:plugins.ibmIOs.dashboard.charts.auxiliaryStoragePool.capacity')],
              formatter: bytes.detailed,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmIOs.dashboard.charts.temporaryStorage.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['currTempStorage', 'maxTempStorage'],
              labels: [
                t('in-forge:plugins.ibmIOs.dashboard.charts.temporaryStorage.current'),
                t('in-forge:plugins.ibmIOs.dashboard.charts.temporaryStorage.max')
              ],
              formatter: bytes.detailed,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <AspTable snapshot={snapshot} timeConfig={timeConfig} />
      <MemoryPoolsTable snapshot={snapshot} timeConfig={timeConfig} />
      <OutputQueueTable snapshot={snapshot} timeConfig={timeConfig} />

      <Columize>
        <DashboardSection title={t('in-forge:plugins.ibmIOs.dashboard.charts.totalSpoolSpace.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['totalSpoolSpace'],
              labels: [t('in-forge:plugins.ibmIOs.dashboard.charts.totalSpoolSpace.totalSize')],
              formatter: bytes.detailed,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <UserSpoolSpaceTable snapshotId={snapshotId} />
      </Columize>
      <JobQueueTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <SubsystemTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <HistoryLogTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
