import {
  millis,
  number
} from 'in-services/formatters/number';
import {getMetricMatch} from 'in-sdk/metrics/metricDefinitions';


export default [
  {
    metrics: [
      'threadPools.webContainer.activeThreads',
      'threadPools.webContainer.poolSize'
    ],
    labels: [
      'Active Threads',
      'Pool Size'
    ],
    min: 0,
    category: ['Thread Pool'],
    formatter: number
  },
  {
    metric: getMetricMatch('sessionManagers', 'activeCount'),
    label: 'Sessions',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('servlets', 'avgResponseTime'),
    label: 'Average Response Time',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('servlets', 'requests'),
    label: 'Request Count',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('servlets', 'errors'),
    label: 'Errors',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('datasources', 'poolSize'),
    label: 'Pool Size',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('datasources', 'freePoolSize'),
    label: 'Free Connections in Pool',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('datasources', 'waitingThreadCount'),
    label: 'Threads Waiting for Connection',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('datasources', 'averageWaitTime'),
    label: 'Average Waiting Time',
    min: 0,
    formatter: millis
  }
];
