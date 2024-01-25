/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { number, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import CicsConnectionsTable from './CicsConnectionsTable';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function zCtgDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.zCtg.cpuUtilization')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="CICSTG_Region_Overview.cpu_utilization"
            formatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zCtg.totalRequestsPerMinute')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="CICSTG_Region_Overview.requests_per_minute"
            formatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zCtg.allocatedConnectionManagerThreads')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="CICSTG_Connection_Manager_Threads.current_number_allocated"
            formatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zCtg.allocatedWorkerThreads')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="CICSTG_Worker_Threads.current_number_allocated"
            formatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zCtg.gatewayDaemonHealth')}>
          <MetricValue snapshotId={snapshotId} metric="CICSTG_Region_Overview.health" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.zCtg.cpuUtilization')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['CICSTG_Region_Overview.cpu_utilization'],
              labels: [t('in-forge:plugins.zCtg.cpuUtilization')],
              formatter: percentagePlainTwoDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.zCtg.ioPerMinute')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['CICSTG_Region_Overview.io_per_minute'],
              labels: [t('in-forge:plugins.zCtg.ioPerMinute')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.zCtg.gatewayDaemonHealth')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['CICSTG_Region_Overview.health'],
              labels: [t('in-forge:plugins.zCtg.gatewayDaemonHealth')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.zCtg.totalRequestsPerMinute')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['CICSTG_Region_Overview.requests_per_minute'],
              labels: [t('in-forge:plugins.zCtg.totalRequestsPerMinute')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.zCtg.clientConnecttimeoutPerMinute')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['CICSTG_Connection_Manager_Threads.times_connecttimeout_limit_hit_per_minute'],
              labels: [t('in-forge:plugins.zCtg.timesConnecttimeoutLimitHitPerMinute')],
              formatter: percentagePlainTwoDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.zCtg.threads')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'CICSTG_Connection_Manager_Threads.current_number_created',
              'CICSTG_Connection_Manager_Threads.current_number_allocated'
            ],
            labels: [
              t('in-forge:plugins.zCtg.connectionManagerThreadsCreated'),
              t('in-forge:plugins.zCtg.connectionManagerThreadsAllocated')
            ],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['CICSTG_Worker_Threads.current_number_created', 'CICSTG_Worker_Threads.current_number_allocated'],
            labels: [
              t('in-forge:plugins.zCtg.workerThreadsCreated'),
              t('in-forge:plugins.zCtg.workerThreadsAllocated')
            ],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['CICSTG_Connection_Manager_Threads.number_waiting'],
            labels: [t('in-forge:plugins.zCtg.numberWaiting')],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <CicsConnectionsTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
