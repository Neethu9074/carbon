/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { millis, number, hitRate } from 'in-services/formatters/number';

export default [
  {
    metrics: ['hotRod.numberOfLocalConnections', 'hotRod.numberOfGlobalConnections'],
    labels: ['Number Of Local Connections', 'Number Of Global Connections'],
    min: 0,
    category: ['Connections'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'hitRatioV2', 'Cache'),
    label: 'Hit Ratio',
    category: ['Cache Stats'],
    min: 0,
    formatter: hitRate
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'hits', 'Cache'),
    label: 'Hits',
    category: ['Cache Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'misses', 'Cache'),
    label: 'Misses',
    category: ['Cache Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'removeHits', 'Cache'),
    label: 'Remove Hits',
    category: ['Cache Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'removeMisses', 'Cache'),
    label: 'Remove Misses',
    category: ['Cache Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'averageReadTime', 'Cache'),
    label: 'Average Read Time',
    category: ['Cache Stats'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'averageWriteTime', 'Cache'),
    label: 'Average Write Time',
    category: ['Cache Stats'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'averageRemoveTime', 'Cache'),
    label: 'Average Remove Time',
    category: ['Cache Stats'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'throughput', 'Cache'),
    label: 'Throughput (ops/sec)',
    category: ['Cache Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'stores', 'Cache'),
    label: 'Cache Puts',
    category: ['Cache Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'readWriteRatioV2', 'Cache'),
    label: 'Read/Write Ratio',
    category: ['Cache Stats'],
    min: 0,
    formatter: hitRate
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'numberOfEntries', 'Cache'),
    label: 'Entries',
    category: ['Cache Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'evictions', 'Cache'),
    label: 'Evictions',
    category: ['Cache Stats'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'defaultThreadsSize', 'Cluster'),
    label: 'Incoming Messages Threads Size',
    min: 0,
    category: ['Thread Pools'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'defaultActiveThreadsSize', 'Cluster'),
    label: 'Incoming Messages Active Threads Size',
    min: 0,
    category: ['Thread Pools'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'defaultQueueSize', 'Cluster'),
    label: 'Incoming Messages Queue Size',
    min: 0,
    category: ['Thread Pools'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'oobThreadsSize', 'Cluster'),
    label: 'OOB Messages Threads Size',
    min: 0,
    category: ['Thread Pools'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'oobActiveThreadsSize', 'Cluster'),
    label: 'OOB Messages Active Threads Size',
    min: 0,
    category: ['Thread Pools'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'oobQueueSize', 'Cluster'),
    label: 'OOB Messages Queue Size',
    min: 0,
    category: ['Thread Pools'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'timerThreadsSize', 'Cluster'),
    label: 'Timer Threads Size',
    min: 0,
    category: ['Thread Pools'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'timerQueueSize', 'Cluster'),
    label: 'Timer Queue Size',
    min: 0,
    category: ['Thread Pools'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'timerTasks', 'Cluster'),
    label: 'Timer Tasks Size',
    min: 0,
    category: ['Thread Pools'],
    formatter: number
  }
];
