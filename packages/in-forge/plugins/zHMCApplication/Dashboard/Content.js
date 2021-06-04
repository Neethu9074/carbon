/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';
import LparTable from './LparTable';
import { t } from 'in-i18n';

export default function ZHMCDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.zHMCApplication.dashboard.cpcProcessorUsage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="cpuUsage.cpcProcessorUsage"
            formatter={percentageZeroDecimalPlaces}
          />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.zHMCApplication.dashboard.powerConsumptionWatts')}>
          <MetricValue snapshotId={snapshotId} metric="cpuUsage.powerConsumptionWatts" />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.zHMCApplication.dashboard.channelUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpuUsage.channelUsage'],
            labels: [t('in-forge:plugins.zHMCApplication.channelUsage')],
            formatter: percentageZeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.zHMCApplication.dashboard.all')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'cpuUsage.iipAllProcessorUsage',
              'cpuUsage.iflAllProcessorUsage',
              'cpuUsage.icfAllProcessorUsage',
              'cpuUsage.cbpAllProcessorUsage',
              'cpuUsage.cpAllProcessorUsage'
            ],
            labels: [
              t('in-forge:plugins.zHMCApplication.iip'),
              t('in-forge:plugins.zHMCApplication.ifl'),
              t('in-forge:plugins.zHMCApplication.icf'),
              t('in-forge:plugins.zHMCApplication.cbp'),
              t('in-forge:plugins.zHMCApplication.cp')
            ],
            formatter: percentageZeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.zHMCApplication.dashboard.shared')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'cpuUsage.iflSharedProcessorUsage',
              'cpuUsage.icfSharedProcessorUsage',
              'cpuUsage.cbpSharedProcessorUsage',
              'cpuUsage.cpSharedProcessorUsage',
              'cpuUsage.aapSharedProcessorUsage'
            ],
            labels: [
              t('in-forge:plugins.zHMCApplication.ifl'),
              t('in-forge:plugins.zHMCApplication.icf'),
              t('in-forge:plugins.zHMCApplication.cbp'),
              t('in-forge:plugins.zHMCApplication.cp'),
              t('in-forge:plugins.zHMCApplication.aap')
            ],
            formatter: percentageZeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.zHMCApplication.dashboard.dedicated')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'cpuUsage.iflDedicatedProcessorUsage',
              'cpuUsage.icfDedicatedProcessorUsage',
              'cpuUsage.cbpDedicatedProcessorUsage',
              'cpuUsage.cpDedicatedProcessorUsage',
              'cpuUsage.aapDedicatedProcessorUsage'
            ],
            labels: [
              t('in-forge:plugins.zHMCApplication.ifl'),
              t('in-forge:plugins.zHMCApplication.icf'),
              t('in-forge:plugins.zHMCApplication.cbp'),
              t('in-forge:plugins.zHMCApplication.cp'),
              t('in-forge:plugins.zHMCApplication.aap')
            ],
            formatter: percentageZeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.zHMCApplication.dashboard.temperature')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpuUsage.temperatureCelsius'],
            labels: [t('in-forge:plugins.zHMCApplication.temperature')],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <LparTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
