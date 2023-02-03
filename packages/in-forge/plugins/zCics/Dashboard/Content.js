/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, bytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function zCicsDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.zCics.cpuUtilization')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="CICSplex_Region_Overview.cpu_utilization"
            formatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zCics.storageViolations')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="CICSplex_Region_Overview.storage_violations"
            formatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zCics.enqueueWaits')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="CICSplex_Region_Overview.enqueue_waits"
            formatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zCics.aids')}>
          <MetricValue snapshotId={snapshotId} metric="CICSplex_Region_Overview.aids" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zCics.ices')}>
          <MetricValue snapshotId={snapshotId} metric="CICSplex_Region_Overview.ices" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zCics.sos')}>
          {snapshot.getIn(['data', 'CICSplex_Region_Overview.sos'])}
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.zCics.transactionRate')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['CICSplex_Region_Overview.transaction_rate'],
              labels: [t('in-forge:plugins.zCics.transactionRate')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.zCics.maximumTasksPercent')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['CICSplex_Region_Overview.maximum_tasks_percent'],
              labels: [t('in-forge:plugins.zCics.maximumTasksPercent')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.zCics.rates')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'CICSplex_Region_Overview.cpu_utilization',
                'CICSplex_Region_Overview.io_rate',
                'CICSplex_Region_Overview.page_rate'
              ],
              labels: [
                t('in-forge:plugins.zCics.cpuUtilization'),
                t('in-forge:plugins.zCics.ioRate'),
                t('in-forge:plugins.zCics.pageRate')
              ],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.zCics.performance')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'CICSplex_Region_Overview.worst_region_performance_index',
                'CICSplex_Region_Overview.queued_remote_requests'
              ],
              labels: [
                t('in-forge:plugins.zCics.worstRegionPerformanceIndex'),
                t('in-forge:plugins.zCics.queuedRemoteRequests')
              ],
              formatter: bytes,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
