/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { bytesTwoDecimalPlaces, timeBySecondsTwoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import OtelProcessesList from 'in-forge/plugins/otelProcess/OtelProcessesList';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ProcessDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.otelProcess.dashboard.cpu_time_user')}>
          <MetricValue snapshotId={snapshotId} metric="cpu_time.user" formatter={timeBySecondsTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.otelProcess.dashboard.cpu_time_system')}>
          <MetricValue snapshotId={snapshotId} metric="cpu_time.system" formatter={timeBySecondsTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.otelProcess.dashboard.cpu_time_wait')}>
          <MetricValue snapshotId={snapshotId} metric="cpu_time.wait" formatter={timeBySecondsTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.otelProcess.dashboard.memory')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesTwoDecimalPlaces,
              metrics: ['memory.usage', 'memory.virtual'],
              labels: [
                t('in-forge:plugins.otelProcess.dashboard.memoryUsage'),
                t('in-forge:plugins.otelProcess.dashboard.memoryVirtual')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.otelProcess.dashboard.disk')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesTwoDecimalPlaces,
              metrics: ['disk_io.read', 'disk_io.write'],
              labels: [
                t('in-forge:plugins.otelProcess.dashboard.diskRead'),
                t('in-forge:plugins.otelProcess.dashboard.diskWrite')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <OtelProcessesList snapshotId={snapshotId} />
    </div>
  );
}
