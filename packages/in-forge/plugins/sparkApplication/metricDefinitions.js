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

export default [
  {
    metrics: ['failedJobs', 'completedJobs', 'activeJobs'],
    labels: ['All Failed Jobs', 'All Completed Jobs', 'All Active Jobs'],
    category: ['Jobs'],
    formatter: number,
    min: 0
  },
  {
    metrics: ['pendingStages', 'failedStages', 'completedStages', 'activeStages'],
    labels: ['All Pending Stages', 'All Failed Stages', 'All Completed Stages', 'All Active Stages'],
    category: ['Stages'],
    formatter: number,
    min: 0
  },
  {
    metrics: ['completedBatches'],
    labels: ['Completed Batches per Second'],
    category: ['Batches'],
    formatter: zeroDecimalPlacesPerSecond,
    min: 0
  },
  {
    metrics: ['schedulingDelay'],
    labels: ['Scheduling Delay'],
    category: ['Delay'],
    formatter: ms,
    min: 0
  },
  {
    metrics: ['totalDelay'],
    labels: ['Total Delay'],
    category: ['Delay'],
    formatter: ms,
    min: 0
  },
  {
    metrics: ['processingTime'],
    labels: ['Processing Time'],
    category: ['Processing Time'],
    formatter: ms,
    min: 0
  },
  {
    metrics: ['completedOutputOperations', 'failedOutputOperations'],
    labels: ['Completed Output Operations', 'Failed Output Operations'],
    category: ['Output Operations'],
    formatter: number,
    min: 0
  },
  {
    metrics: ['inputRecords'],
    labels: ['Input Records'],
    category: ['Input Records'],
    formatter: number,
    min: 0
  },
  {
    metrics: ['activeReceivers', 'activeReceivers'],
    labels: ['Active Receivers', 'Inactive Receivers'],
    category: ['Receivers'],
    formatter: number,
    min: 0
  },
  {
    metric: getDynamicMetricMatch('executors', 'completedTasksDelta', 'Executor ID'),
    label: 'Completed Tasks per Second',
    category: ['Executors'],
    min: 0,
    formatter: zeroDecimalPlacesPerSecond
  },
  {
    metric: getDynamicMetricMatch('executors', 'failedTasksDelta', 'Executor ID'),
    label: 'Failed Tasks per Second',
    category: ['Executors'],
    min: 0,
    formatter: zeroDecimalPlacesPerSecond
  },
  {
    metric: getDynamicMetricMatch('executors', 'completedTasks', 'Executor ID'),
    label: 'All Completed Tasks',
    category: ['Executors'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('executors', 'failedTasks', 'Executor ID'),
    label: 'All Failed Tasks',
    category: ['Executors'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('executors', 'rddBlocks', 'Executor ID'),
    label: 'RDD Blocks',
    category: ['Executors'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('executors', 'memoryUsed', 'Executor ID'),
    label: 'Storage Memory',
    category: ['Executors'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('executors', 'diskUsed', 'Executor ID'),
    label: 'Disk Used',
    category: ['Executors'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('executors', 'inputBytesDelta', 'Executor ID'),
    label: 'Input Bytes per Second',
    category: ['Executors'],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('executors', 'shuffleReadDelta', 'Executor ID'),
    label: 'Shuffle Read per Second',
    category: ['Executors'],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('executors', 'shuffleWriteDelta', 'Executor ID'),
    label: 'Shuffle Write per Second',
    category: ['Executors'],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('executors', 'inputBytes', 'Executor ID'),
    label: 'Total Input Bytes',
    category: ['Executors'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('executors', 'shuffleRead', 'Executor ID'),
    label: 'Total Shuffle Read',
    category: ['Executors'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('executors', 'shuffleWrite', 'Executor ID'),
    label: 'Total Shuffle Write',
    category: ['Executors'],
    min: 0,
    formatter: bytes
  }
];
