/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  number,
  ms,
  zeroDecimalPlacesPerSecond,
  bytes,
  bytesPerSecondTwoDecimalPlaces
} from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['failedJobs', 'completedJobs', 'activeJobs'],
    labels: [
      t('in-forge:plugins.sparkApplication.allFailedJobs'),
      t('in-forge:plugins.sparkApplication.allCompletedJobs'),
      t('in-forge:plugins.sparkApplication.allActiveJobs')
    ],
    category: [t('in-forge:plugins.sparkApplication.jobs')],
    formatter: number,
    min: 0
  },
  {
    metrics: ['pendingStages', 'failedStages', 'completedStages', 'activeStages'],
    labels: [
      t('in-forge:plugins.sparkApplication.allPendingStages'),
      t('in-forge:plugins.sparkApplication.allFailedStages'),
      t('in-forge:plugins.sparkApplication.allCompletedStages'),
      t('in-forge:plugins.sparkApplication.allActiveStages')
    ],
    category: [t('in-forge:plugins.sparkApplication.stages')],
    formatter: number,
    min: 0
  },
  {
    metrics: ['completedBatches'],
    labels: [t('in-forge:plugins.sparkApplication.completedBatchesPerSecond')],
    category: [t('in-forge:plugins.sparkApplication.batches')],
    formatter: zeroDecimalPlacesPerSecond,
    min: 0
  },
  {
    metrics: ['schedulingDelay'],
    labels: [t('in-forge:plugins.sparkApplication.schedulingDelay')],
    category: [t('in-forge:plugins.sparkApplication.delay')],
    formatter: ms,
    min: 0
  },
  {
    metrics: ['totalDelay'],
    labels: [t('in-forge:plugins.sparkApplication.totalDelay')],
    category: [t('in-forge:plugins.sparkApplication.delay')],
    formatter: ms,
    min: 0
  },
  {
    metrics: ['processingTime'],
    labels: [t('in-forge:plugins.sparkApplication.processingTime')],
    category: [t('in-forge:plugins.sparkApplication.processingTime')],
    formatter: ms,
    min: 0
  },
  {
    metrics: ['completedOutputOperations', 'failedOutputOperations'],
    labels: [
      t('in-forge:plugins.sparkApplication.completedOutputOperations'),
      t('in-forge:plugins.sparkApplication.failedOutputOperations')
    ],
    category: [t('in-forge:plugins.sparkApplication.outputOperations')],
    formatter: number,
    min: 0
  },
  {
    metrics: ['inputRecords'],
    labels: [t('in-forge:plugins.sparkApplication.inputRecords')],
    category: [t('in-forge:plugins.sparkApplication.inputRecords')],
    formatter: number,
    min: 0
  },
  {
    metrics: ['activeReceivers', 'activeReceivers'],
    labels: [
      t('in-forge:plugins.sparkApplication.activeReceivers'),
      t('in-forge:plugins.sparkApplication.inactiveReceivers')
    ],
    category: [t('in-forge:plugins.sparkApplication.receivers')],
    formatter: number,
    min: 0
  },
  {
    metric: getDynamicMetricMatch('executors', 'completedTasksDelta', 'Executor ID'),
    label: t('in-forge:plugins.sparkApplication.completedTasksPerSecond'),
    category: [t('in-forge:plugins.sparkApplication.executors')],
    min: 0,
    formatter: zeroDecimalPlacesPerSecond
  },
  {
    metric: getDynamicMetricMatch('executors', 'failedTasksDelta', 'Executor ID'),
    label: t('in-forge:plugins.sparkApplication.failedTasksPerSecond'),
    category: [t('in-forge:plugins.sparkApplication.executors')],
    min: 0,
    formatter: zeroDecimalPlacesPerSecond
  },
  {
    metric: getDynamicMetricMatch('executors', 'completedTasks', 'Executor ID'),
    label: t('in-forge:plugins.sparkApplication.allCompletedTasks'),
    category: [t('in-forge:plugins.sparkApplication.executors')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('executors', 'failedTasks', 'Executor ID'),
    label: t('in-forge:plugins.sparkApplication.allFailedTasks'),
    category: [t('in-forge:plugins.sparkApplication.executors')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('executors', 'rddBlocks', 'Executor ID'),
    label: t('in-forge:plugins.sparkApplication.rddBlocks'),
    category: [t('in-forge:plugins.sparkApplication.executors')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('executors', 'memoryUsed', 'Executor ID'),
    label: t('in-forge:plugins.sparkApplication.storageMemory'),
    category: [t('in-forge:plugins.sparkApplication.executors')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('executors', 'diskUsed', 'Executor ID'),
    label: t('in-forge:plugins.sparkApplication.diskUsed'),
    category: [t('in-forge:plugins.sparkApplication.executors')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('executors', 'inputBytesDelta', 'Executor ID'),
    label: t('in-forge:plugins.sparkApplication.inputBytesPerSecond'),
    category: [t('in-forge:plugins.sparkApplication.executors')],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('executors', 'shuffleReadDelta', 'Executor ID'),
    label: t('in-forge:plugins.sparkApplication.shuffleReadPerSecond'),
    category: [t('in-forge:plugins.sparkApplication.executors')],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('executors', 'shuffleWriteDelta', 'Executor ID'),
    label: t('in-forge:plugins.sparkApplication.shuffleWritePerSecond'),
    category: [t('in-forge:plugins.sparkApplication.executors')],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('executors', 'inputBytes', 'Executor ID'),
    label: t('in-forge:plugins.sparkApplication.totalInputBytes'),
    category: [t('in-forge:plugins.sparkApplication.executors')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('executors', 'shuffleRead', 'Executor ID'),
    label: t('in-forge:plugins.sparkApplication.totalShuffleRead'),
    category: [t('in-forge:plugins.sparkApplication.executors')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('executors', 'shuffleWrite', 'Executor ID'),
    label: t('in-forge:plugins.sparkApplication.totalShuffleWrite'),
    category: [t('in-forge:plugins.sparkApplication.executors')],
    min: 0,
    formatter: bytes
  }
];
