/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import {
  percentagePlainTwoDecimalPlaces,
  zeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  meanLatency
} from 'in-services/formatters/number';
// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AzureDataFactoryDashboard({
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
        <KpiKeyValue label={t('in-forge:plugins.azureDataFactory.kpi.labelPipelineSucceededRunsPercentage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="pipelineSucceededRunsPercentage"
            formatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureDataFactory.kpi.labelActivitiesSucceededRunsPercentage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="activitySucceededRunsPercentage"
            formatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>

      {/* Pipelines */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titlePipelinesSucceeded')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['pipelineSucceededRuns'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['pipelineSucceededRunsPercentage'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelPercentage')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titlePipelinesFailed')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['pipelineFailedRuns'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['pipelineFailedRunsPercentage'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelPercentage')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titlePipelinesCancelled')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['pipelineCancelledRuns'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['pipelineCancelledRunsPercentage'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelPercentage')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titlePipelinesTotal')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['pipelineTotalRuns'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titlePipelines')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['pipelineElapsedTimeRuns'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelPipelineElapsedTime')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Activity */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleActivitiesSucceeded')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['activitySucceededRuns'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['activitySucceededRunsPercentage'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelPercentage')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleActivitiesFailed')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['activityFailedRuns'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['activityFailedRunsPercentage'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelPercentage')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleActivitiesCancelled')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['activityCancelledRuns'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['activityCancelledRunsPercentage'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelPercentage')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleActivitiesTotal')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['activityTotalRuns'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Triggers */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleTriggersSucceeded')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['triggerSucceededRuns'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['triggerSucceededRunsPercentage'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelPercentage')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleTriggersFailed')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['triggerFailedRuns'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['triggerFailedRunsPercentage'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelPercentage')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleTriggersCancelled')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['triggerCancelledRuns'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['triggerCancelledRunsPercentage'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelPercentage')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleTriggersTotal')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['triggerTotalRuns'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Runtime */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleRuntimeMemory')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['integrationRuntimeAvailableMemory'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelAvailable')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleRuntimeCPU')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['integrationRuntimeCpuPercentage'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelPercentage')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleRuntimeQueue')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['integrationRuntimeQueueLength'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelLength')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {/* Airflow */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleAirflowCPU')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['airflowIntegrationRuntimeCpuPercentage'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelPercentage')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleAirflowMemory')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['airflowIntegrationRuntimeMemoryPercentage'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelPercentage')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleAirflowTasks')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: [
                'airflowIntegrationRuntimeSchedulerTasksRunning',
                'airflowIntegrationRuntimeExecutorQueuedTasks'
              ],
              labels: [
                t('in-forge:plugins.azureDataFactory.dashboard.labelRunning'),
                t('in-forge:plugins.azureDataFactory.dashboard.labelQueued')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleAirflowOperators')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['airflowIntegrationRuntimeOperatorSuccesses', 'airflowIntegrationRuntimeOperatorFailures'],
              labels: [
                t('in-forge:plugins.azureDataFactory.dashboard.labelSucceeded'),
                t('in-forge:plugins.azureDataFactory.dashboard.labelFailed')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleAirflowTriggers')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: [
                'airflowIntegrationRuntimeTriggersSucceeded',
                'airflowIntegrationRuntimeTriggersRunning',
                'airflowIntegrationRuntimeTriggersFailed'
              ],
              labels: [
                t('in-forge:plugins.azureDataFactory.dashboard.labelSucceeded'),
                t('in-forge:plugins.azureDataFactory.dashboard.labelRunning'),
                t('in-forge:plugins.azureDataFactory.dashboard.labelFailed')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleAirflowJobs')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: [
                'airflowIntegrationRuntimeJobStart',
                'airflowIntegrationRuntimeJobEnd',
                'airflowIntegrationRuntimeJobHeartbeatFailure'
              ],
              labels: [
                t('in-forge:plugins.azureDataFactory.dashboard.labelStarted'),
                t('in-forge:plugins.azureDataFactory.dashboard.labelEnded'),
                t('in-forge:plugins.azureDataFactory.dashboard.labelHeartbeatFailed')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureDataFactory.dashboard.titleAirflowDAGProcessing')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: meanLatency.detailed,
              metrics: ['airflowIntegrationRuntimeDAGProcessingLastDuration'],
              labels: [t('in-forge:plugins.azureDataFactory.dashboard.labelLastDuration')],
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
