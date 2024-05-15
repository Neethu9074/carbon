/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { percentagePlainTwoDecimalPlaces, number, megaBytes } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AzureMachineLearningDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');

  return (
    <>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.azureMachineLearning.kpi.labelCpuUtilization')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="cpuUtilizationPercentage"
            formatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureMachineLearning.kpi.labelActiveNodes')}>
          <MetricValue snapshotId={snapshotId} metric="activeNodes" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureMachineLearning.dashboard.titleProcessorUtilization')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['cpuUtilizationPercentage', 'gpuUtilizationPercentage'],
              labels: [
                t('in-forge:plugins.azureMachineLearning.dashboard.labelCpuUtilization'),
                t('in-forge:plugins.azureMachineLearning.dashboard.labelGpuUtilization')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureMachineLearning.dashboard.titleCores')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['activeCores', 'totalCores'],
              labels: [
                t('in-forge:plugins.azureMachineLearning.dashboard.labelActiveCores'),
                t('in-forge:plugins.azureMachineLearning.dashboard.labelTotalCores')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureMachineLearning.dashboard.titleNodes')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['activeNodes', 'totalNodes'],
              labels: [
                t('in-forge:plugins.azureMachineLearning.dashboard.labelActiveNodes'),
                t('in-forge:plugins.azureMachineLearning.dashboard.labelTotalNodes')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureMachineLearning.dashboard.titleRuns')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['cancelledRuns', 'completedRuns', 'failedRuns', 'startedRuns', 'errors'],
              labels: [
                t('in-forge:plugins.azureMachineLearning.dashboard.labelCancelledRuns'),
                t('in-forge:plugins.azureMachineLearning.dashboard.labelCompletedRuns'),
                t('in-forge:plugins.azureMachineLearning.dashboard.labelFailedRuns'),
                t('in-forge:plugins.azureMachineLearning.dashboard.labelStartedRuns'),
                t('in-forge:plugins.azureMachineLearning.dashboard.labelErrors')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureMachineLearning.dashboard.tileDisk')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: megaBytes.compact,
              metrics: ['diskUsedMegabytes', 'diskReadMegabytes', 'diskWriteMegabytes'],
              labels: [
                t('in-forge:plugins.azureMachineLearning.dashboard.labelDiskUsedMegabytes'),
                t('in-forge:plugins.azureMachineLearning.dashboard.labelDiskReadMegabytes'),
                t('in-forge:plugins.azureMachineLearning.dashboard.labelDiskWriteMegabytes')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </>
  );
}
