/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  zeroDecimalPlaces,
  percentagePlainTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  meanLatency
} from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['integrationRuntimeAvailableMemory'],
    labels: [t('in-forge:plugins.azureDataFactory.labelIntegrationRuntimeAvailableMemory')],
    formatter: bytesZeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['airflowIntegrationRuntimeDAGProcessingLastDuration'],
    labels: [t('in-forge:plugins.azureDataFactory.labelAirflowIntegrationRuntimeDAGProcessingLastDuration')],
    formatter: meanLatency.detailed,
    min: 0
  },
  {
    metrics: [
      'integrationRuntimeCpuPercentage',
      'airflowIntegrationRuntimeCpuPercentage',
      'airflowIntegrationRuntimeMemoryPercentage'
    ],
    labels: [
      t('in-forge:plugins.azureDataFactory.labelIntegrationRuntimeCpuPercentage'),
      t('in-forge:plugins.azureDataFactory.labelAirflowIntegrationRuntimeCpuPercentage'),
      t('in-forge:plugins.azureDataFactory.labelAirflowIntegrationRuntimeMemoryPercentage')
    ],
    formatter: percentagePlainTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      'pipelineElapsedTimeRuns',
      'pipelineFailedRuns',
      'pipelineSucceededRuns',
      'pipelineCancelledRuns',
      'pipelineTotalRuns',
      'pipelineFailedRunsPercentage',
      'pipelineSucceededRunsPercentage',
      'pipelineCancelledRunsPercentage',
      'activityFailedRuns',
      'activitySucceededRuns',
      'activityCancelledRuns',
      'activityTotalRuns',
      'activityFailedRunsPercentage',
      'activitySucceededRunsPercentage',
      'activityCancelledRunsPercentage',
      'triggerFailedRuns',
      'triggerSucceededRuns',
      'triggerCancelledRuns',
      'triggerTotalRuns',
      'triggerFailedRunsPercentage',
      'triggerSucceededRunsPercentage',
      'triggerCancelledRunsPercentage',
      'integrationRuntimeQueueLength',
      'airflowIntegrationRuntimeJobStart',
      'airflowIntegrationRuntimeJobEnd',
      'airflowIntegrationRuntimeJobHeartbeatFailure',
      'airflowIntegrationRuntimeOperatorFailures',
      'airflowIntegrationRuntimeOperatorSuccesses',
      'airflowIntegrationRuntimeTriggersFailed',
      'airflowIntegrationRuntimeTriggersSucceeded',
      'airflowIntegrationRuntimeSchedulerTasksRunning',
      'airflowIntegrationRuntimeExecutorQueuedTasks',
      'airflowIntegrationRuntimeTriggersRunning'
    ],
    labels: [
      t('in-forge:plugins.azureDataFactory.labelPipelineElapsedTimeRuns'),
      t('in-forge:plugins.azureDataFactory.labelPipelineFailedRuns'),
      t('in-forge:plugins.azureDataFactory.labelPipelineSucceededRuns'),
      t('in-forge:plugins.azureDataFactory.labelPipelineCancelledRuns'),
      t('in-forge:plugins.azureDataFactory.labelPipelineTotalRuns'),
      t('in-forge:plugins.azureDataFactory.labelPipelineFailedRunsPercentage'),
      t('in-forge:plugins.azureDataFactory.labelPipelineSucceededRunsPercentage'),
      t('in-forge:plugins.azureDataFactory.labelPipelineCancelledRunsPercentage'),
      t('in-forge:plugins.azureDataFactory.labelActivityFailedRuns'),
      t('in-forge:plugins.azureDataFactory.labelActivitySucceededRuns'),
      t('in-forge:plugins.azureDataFactory.labelActivityCancelledRuns'),
      t('in-forge:plugins.azureDataFactory.labelActivityTotalRuns'),
      t('in-forge:plugins.azureDataFactory.labelActivityFailedRunsPercentage'),
      t('in-forge:plugins.azureDataFactory.labelActivitySucceededRunsPercentage'),
      t('in-forge:plugins.azureDataFactory.labelActivityCancelledRunsPercentage'),
      t('in-forge:plugins.azureDataFactory.labelTriggerFailedRuns'),
      t('in-forge:plugins.azureDataFactory.labelTriggerSucceededRuns'),
      t('in-forge:plugins.azureDataFactory.labelTriggerCancelledRuns'),
      t('in-forge:plugins.azureDataFactory.labelTriggerTotalRuns'),
      t('in-forge:plugins.azureDataFactory.labelTriggerFailedRunsPercentage'),
      t('in-forge:plugins.azureDataFactory.labelTriggerSucceededRunsPercentage'),
      t('in-forge:plugins.azureDataFactory.labelTriggerCancelledRunsPercentage'),
      t('in-forge:plugins.azureDataFactory.labelIntegrationRuntimeQueueLength'),
      t('in-forge:plugins.azureDataFactory.labelAirflowIntegrationRuntimeJobStart'),
      t('in-forge:plugins.azureDataFactory.labelAirflowIntegrationRuntimeJobEnd'),
      t('in-forge:plugins.azureDataFactory.labelAirflowIntegrationRuntimeJobHeartbeatFailure'),
      t('in-forge:plugins.azureDataFactory.labelAirflowIntegrationRuntimeOperatorFailures'),
      t('in-forge:plugins.azureDataFactory.labelAirflowIntegrationRuntimeOperatorSuccesses'),
      t('in-forge:plugins.azureDataFactory.labelAirflowIntegrationRuntimeTriggersFailed'),
      t('in-forge:plugins.azureDataFactory.labelAirflowIntegrationRuntimeTriggersSucceeded'),
      t('in-forge:plugins.azureDataFactory.labelAirflowIntegrationRuntimeSchedulerTasksRunning'),
      t('in-forge:plugins.azureDataFactory.labelAirflowIntegrationRuntimeExecutorQueuedTasks'),
      t('in-forge:plugins.azureDataFactory.labelAirflowIntegrationRuntimeTriggersRunning')
    ],
    formatter: zeroDecimalPlaces,
    min: 0
  }
];
