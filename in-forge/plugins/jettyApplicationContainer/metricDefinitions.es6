import {
  number
} from 'in-services/formatters/number';
import {getMetricMatch} from 'in-sdk/metrics/metricDefinitions';


export default [
  {
    metrics: [
      'idleThreads',
      'busyThreads',
      'threads',
      'threadsQueueSize'
    ],
    labels: [
      'Idle Threads',
      'Busy Threads',
      'Total Threads',
      'Threads Queue Size'
    ],
    min: 0,
    category: ['Thread'],
    formatter: number
  },
  {
    metric: getMetricMatch('webAppsSessionData', 'sessions'),
    label: 'Active Sessions',
    min: 0,
    formatter: number
  }
];
