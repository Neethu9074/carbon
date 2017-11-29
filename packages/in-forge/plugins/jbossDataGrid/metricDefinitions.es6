import { percentage, millis, number } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['hotRod.numberOfLocalConnections', 'hotRod.numberOfGlobalConnections'],
    labels: ['Number Of Local Connections', 'Number Of Global Connections'],
    min: 0,
    category: ['Connections'],
    formatter: number
  },
  {
    metric: getMetricMatch('cachesStatistics', 'hitRatio'),
    label: 'Hit Ratio',
    min: 0,
    formatter: percentage
  },
  {
    metric: getMetricMatch('cachesStatistics', 'hits'),
    label: 'Hits',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('cachesStatistics', 'misses'),
    label: 'Misses',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('cachesStatistics', 'removeHits'),
    label: 'Remove Hits',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('cachesStatistics', 'removeMisses'),
    label: 'Remove Misses',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('cachesStatistics', 'averageReadTime'),
    label: 'Average Read Time',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('cachesStatistics', 'averageWriteTime'),
    label: 'Average Write Time',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('cachesStatistics', 'averageRemoveTime'),
    label: 'Average Remove Time',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('cachesStatistics', 'throughput'),
    label: 'Throughput (ops/sec)',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('cachesStatistics', 'stores'),
    label: 'Cache Puts',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('cachesStatistics', 'readWriteRatio'),
    label: 'Read/Write Ratio',
    min: 0,
    formatter: percentage
  },
  {
    metric: getMetricMatch('cachesStatistics', 'numberOfEntries'),
    label: 'Entries',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('cachesStatistics', 'evictions'),
    label: 'Evictions',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('clustersUDPStatistics', 'defaultThreadsSize'),
    label: 'Incoming Messages Threads Size',
    min: 0,
    category: ['network'],
    formatter: number
  },
  {
    metric: getMetricMatch('clustersUDPStatistics', 'defaultActiveThreadsSize'),
    label: 'Incoming Messages Active Threads Size',
    min: 0,
    category: ['network'],
    formatter: number
  },
  {
    metric: getMetricMatch('clustersUDPStatistics', 'defaultQueueSize'),
    label: 'Incoming Messages Queue Size',
    min: 0,
    category: ['network'],
    formatter: number
  },
  {
    metric: getMetricMatch('clustersUDPStatistics', 'oobThreadsSize'),
    label: 'OOB Messages Threads Size',
    min: 0,
    category: ['network'],
    formatter: number
  },
  {
    metric: getMetricMatch('clustersUDPStatistics', 'oobActiveThreadsSize'),
    label: 'OOB Messages Active Threads Size',
    min: 0,
    category: ['network'],
    formatter: number
  },
  {
    metric: getMetricMatch('clustersUDPStatistics', 'oobQueueSize'),
    label: 'OOB Messages Queue Size',
    min: 0,
    category: ['network'],
    formatter: number
  },
  {
    metric: getMetricMatch('clustersUDPStatistics', 'timerThreadsSize'),
    label: 'Timer Threads Size',
    min: 0,
    category: ['network'],
    formatter: number
  },
  {
    metric: getMetricMatch('clustersUDPStatistics', 'timerQueueSize'),
    label: 'Timer Queue Size',
    min: 0,
    category: ['network'],
    formatter: number
  },
  {
    metric: getMetricMatch('clustersUDPStatistics', 'timerTasks'),
    label: 'Timer Tasks Size',
    min: 0,
    category: ['network'],
    formatter: number
  }
];
