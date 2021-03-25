/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage, bytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import MemoryPoolsTable from './MemoryPoolTable';
import { t } from 'in-i18n';

export default function IBMiDb2Dashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.ibmiDB2Database.dashboard.charts.cpu.name')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['avgCPURate'],
            labels: [t('in-forge:plugins.ibmiDB2Database.dashboard.charts.cpu.rate')],
            formatter: percentage.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmiDB2Database.dashboard.charts.cpuUtilization.name')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['avgCPUUtil', 'minCPUUtil', 'maxCPUUtil'],
            labels: [
              t('in-forge:plugins.ibmiDB2Database.dashboard.charts.cpuUtilization.avg'),
              t('in-forge:plugins.ibmiDB2Database.dashboard.charts.cpuUtilization.min'),
              t('in-forge:plugins.ibmiDB2Database.dashboard.charts.cpuUtilization.max')
            ],
            formatter: percentage.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmiDB2Database.dashboard.charts.jobs.name')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['activeJobs', 'interactiveJobs', 'totalJobs', 'maxJobs'],
            labels: [
              t('in-forge:plugins.ibmiDB2Database.dashboard.charts.jobs.active'),
              t('in-forge:plugins.ibmiDB2Database.dashboard.charts.jobs.interactive'),
              t('in-forge:plugins.ibmiDB2Database.dashboard.charts.jobs.total'),
              t('in-forge:plugins.ibmiDB2Database.dashboard.charts.jobs.max')
            ],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.ibmiDB2Database.dashboard.charts.auxiliaryStoragePool.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sysASPUsed'],
              labels: [t('in-forge:plugins.ibmiDB2Database.dashboard.charts.auxiliaryStoragePool.used')],
              formatter: percentage.compact,
              type: 'line'
            }}
            y2={{
              min: 0,
              metrics: ['sysASPStorage'],
              labels: [t('in-forge:plugins.ibmiDB2Database.dashboard.charts.auxiliaryStoragePool.capacity')],
              formatter: bytes.detailed,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmiDB2Database.dashboard.charts.temporaryStorage.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['currTempStorage', 'maxTempStorage'],
              labels: [
                t('in-forge:plugins.ibmiDB2Database.dashboard.charts.temporaryStorage.current'),
                t('in-forge:plugins.ibmiDB2Database.dashboard.charts.temporaryStorage.max')
              ],
              formatter: bytes.detailed,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.ibmiDB2Database.dashboard.charts.threads.name')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['activeThreads'],
            labels: [t('in-forge:plugins.ibmiDB2Database.dashboard.charts.threads.active')],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <MemoryPoolsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
