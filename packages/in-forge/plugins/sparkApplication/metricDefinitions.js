import {
  number,
  ms,
  zeroDecimalPlacesPerSecond,
  bytes,
  bytesPerSecondTwoDecimalPlaces
} from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['failedJobs', 'completedJobs', 'activeJobs'],
    labels: ['All Failed Jobs', 'All Completed Jobs', 'All Active Jobs'],
    formatter: number,
    min: 0,
    isAvailable: isBatchApp
  },
  {
    metrics: ['pendingStages', 'failedStages', 'completedStages', 'activeStages'],
    labels: ['All Pending Stages', 'All Failed Stages', 'All Completed Stages', 'All Active Stages'],
    formatter: number,
    min: 0,
    isAvailable: isBatchApp
  },
  {
    metrics: ['completedBatches'],
    labels: ['Completed Batches per Second'],
    formatter: zeroDecimalPlacesPerSecond,
    min: 0,
    isAvailable: isStreamingApp
  },
  {
    metrics: ['schedulingDelay'],
    labels: ['Scheduling Delay'],
    formatter: ms,
    min: 0,
    isAvailable: isStreamingApp
  },
  {
    metrics: ['totalDelay'],
    labels: ['Total Delay'],
    formatter: ms,
    min: 0,
    isAvailable: isStreamingApp
  },
  {
    metrics: ['processingTime'],
    labels: ['Processing Time'],
    formatter: ms,
    min: 0,
    isAvailable: isStreamingApp
  },
  {
    metrics: ['completedOutputOperations', 'failedOutputOperations'],
    labels: ['Completed Output Operations', 'Failed Output Operations'],
    formatter: number,
    min: 0,
    isAvailable: isStreamingApp
  },
  {
    metrics: ['inputRecords'],
    labels: ['Input Records'],
    formatter: number,
    min: 0,
    isAvailable: isStreamingApp
  },
  {
    metrics: ['activeReceivers', 'activeReceivers'],
    labels: ['Active Receivers', 'Inactive Receivers'],
    formatter: number,
    min: 0,
    isAvailable: isStreamingApp
  },
  {
    metric: getMetricMatch('executors', 'completedTasksDelta'),
    label: 'Completed Tasks per Second',
    min: 0,
    formatter: zeroDecimalPlacesPerSecond,
    isAvailable: isStreamingApp
  },
  {
    metric: getMetricMatch('executors', 'failedTasksDelta'),
    label: 'Failed Tasks per Second',
    min: 0,
    formatter: zeroDecimalPlacesPerSecond,
    isAvailable: isStreamingApp
  },
  {
    metric: getMetricMatch('executors', 'completedTasks'),
    label: 'All Completed Tasks',
    min: 0,
    formatter: number,
    isAvailable: isBatchApp
  },
  {
    metric: getMetricMatch('executors', 'failedTasks'),
    label: 'All Failed Tasks',
    min: 0,
    formatter: number,
    isAvailable: isBatchApp
  },
  {
    metric: getMetricMatch('executors', 'rddBlocks'),
    label: 'RDD Blocks',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('executors', 'memoryUsed'),
    label: 'Storage Memory',
    min: 0,
    formatter: bytes
  },
  {
    metric: getMetricMatch('executors', 'diskUsed'),
    label: 'Disk Used',
    min: 0,
    formatter: bytes
  },
  {
    metric: getMetricMatch('executors', 'inputBytesDelta'),
    label: 'Input Bytes per Second',
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces,
    isAvailable: isStreamingApp
  },
  {
    metric: getMetricMatch('executors', 'shuffleReadDelta'),
    label: 'Shuffle Read per Second',
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces,
    isAvailable: isStreamingApp
  },
  {
    metric: getMetricMatch('executors', 'shuffleWriteDelta'),
    label: 'Shuffle Write per Second',
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces,
    isAvailable: isStreamingApp
  },
  {
    metric: getMetricMatch('executors', 'inputBytes'),
    label: 'Total Input Bytes',
    min: 0,
    formatter: bytes,
    isAvailable: isBatchApp
  },
  {
    metric: getMetricMatch('executors', 'shuffleRead'),
    label: 'Total Shuffle Read',
    min: 0,
    formatter: bytes,
    isAvailable: isBatchApp
  },
  {
    metric: getMetricMatch('executors', 'shuffleWrite'),
    label: 'Total Shuffle Write',
    min: 0,
    formatter: bytes,
    isAvailable: isBatchApp
  }
];

function isStreamingApp(snapshot) {
  return snapshot.getIn(['data', 'streamingApp'], false);
}

function isBatchApp(snapshot) {
  return !isStreamingApp(snapshot);
}
