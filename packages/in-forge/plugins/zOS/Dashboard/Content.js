/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { percentagePlainZeroDecimalPlaces, number } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import CommonStorageTable from './CommonStorageTable';
import MetricValue from 'in-components/MetricValue';
import RealStorageTable from './RealStorageTable';
import { t } from 'in-i18n';

export default function ZOSDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.zOS.cpuUsage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="System_CPU_Utilization.average_cpu_percent"
            formatter={percentagePlainZeroDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zOS.percentLparMsuCapacity')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="System_CPU_Utilization.percent_lpar_msu_capacity"
            formatter={percentagePlainZeroDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zOS.averageUnusedGroupMsus')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="System_CPU_Utilization.average_unused_group_msus"
            formatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zOS.fourHourMsus')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="System_CPU_Utilization.four_hour_msus"
            formatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zOS.hiperdispatchManagement')}>
          {snapshot.getIn(['data', 'System_CPU_Utilization.hiperdispatch_management'])}
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.zOS.avgWorkloadCpu')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          customHeight={300}
          y1={{
            min: 0,
            max: 100,
            metrics: [
              'System_CPU_Utilization.average_cpu_percent',
              'System_CPU_Utilization.average_ifa_percent',
              'System_CPU_Utilization.average_ifa_on_cp_percent',
              'System_CPU_Utilization.average_ziip_percent',
              'System_CPU_Utilization.average_ziip_on_cp_percent',
              'System_CPU_Utilization.mvs_overhead'
            ],
            labels: [
              t('in-forge:plugins.zOS.avgCpuPercentage'),
              t('in-forge:plugins.zOS.avgIfaPercentage'),
              t('in-forge:plugins.zOS.avgIfaCpPercentage'),
              t('in-forge:plugins.zOS.avgziipPercentage'),
              t('in-forge:plugins.zOS.avgziipCpPercentage'),
              t('in-forge:plugins.zOS.mvsOverhead')
            ],
            formatter: percentagePlainZeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.zOS.undispatchedTasks')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['System_CPU_Utilization.undispatched_tasks'],
            labels: [t('in-forge:plugins.zOS.undispatchedTasks')],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <RealStorageTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <CommonStorageTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
