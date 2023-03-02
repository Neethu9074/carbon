/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { micros, number } from 'in-services/formatters/number';
import SubpoolStatisticsTable from './SubpoolStatisticsTable';
import Columize from 'in-sdk/components/dashboard/Columize';
import PoolUtilizationTable from './PoolUtilizationTable';
import DependentRegionTable from './DependentRegionTable';
import AddressSpacesTable from './AddressSpacesTable';
import MetricValue from 'in-components/MetricValue';
import VsamSubPoolTable from './VsamSubPoolTable';
import { t } from 'in-i18n';

export default function zImsDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.zIms.regionCount')}>
          <MetricValue snapshotId={snapshotId} metric="ims_health.region_count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zIms.sharedTransactionQueue')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="ims_health.shared_transaction_queue"
            formatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zIms.longestLock')}>
          <MetricValue snapshotId={snapshotId} metric="ims_health.longest_lock" formatter={micros.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zIms.highestR0Time')}>
          <MetricValue snapshotId={snapshotId} metric="ims_health.highest_r0_time" formatter={micros.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.zIms.systemUtilization')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['ims_health.total_cpu_percent', 'ims_health.total_io_rate'],
              labels: [t('in-forge:plugins.zIms.totalCpuPercent'), t('in-forge:plugins.zIms.totalIoRate')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.zIms.affinityCount')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['ims_health.affinity_count'],
              labels: [t('in-forge:plugins.zIms.affinityCount')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.zIms.lockWaiters')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['ims_health.lock_waiters'],
              labels: [t('in-forge:plugins.zIms.lockWaiters')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.zIms.totalTransactionQueueTransactionRate')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['ims_health.total_transaction_queue', 'ims_health.total_transaction_rate'],
              labels: [
                t('in-forge:plugins.zIms.totalTransactionQueue'),
                t('in-forge:plugins.zIms.totalTransactionRate')
              ],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.zIms.totalDeqEnqRate')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['ims_health.total_deq_rate', 'ims_health.total_enq_rate'],
              labels: [t('in-forge:plugins.zIms.totalDeqRate'), t('in-forge:plugins.zIms.totalEnqRate')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.zIms.totalPagingRate')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['ims_health.total_paging_rate'],
              labels: [t('in-forge:plugins.zIms.totalPagingRate')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <AddressSpacesTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <DependentRegionTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <PoolUtilizationTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <SubpoolStatisticsTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <VsamSubPoolTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
