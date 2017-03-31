import { millis, muSecondsToMillis, number } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['threadPool.activeThreads', 'threadPool.poolSize'],
    labels: ['Active Threads', 'Pool Size'],
    min: 0,
    category: ['Thread Pool'],
    formatter: number
  },
  {
    metric: getMetricMatch('sessions', 'live'),
    label: 'Live Sessions',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('sessions', 'active'),
    label: 'Active Sessions',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('sessions', 'created'),
    label: 'Sessions Created',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('sessions', 'invalidated'),
    label: 'Sessions Invalidated',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('sessions', 'invalidatedByTimeout'),
    label: 'Sessions Invalidated by a Timeout',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('connectionPools', 'managedConnectionCount'),
    label: 'ManagedConnection Objects in Use',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('connectionPools', 'freeConnectionCount'),
    label: 'Free Connections in Pool',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('connectionPools', 'connectionHandleCount'),
    label: 'Connection Objects in Use',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('connectionPools', 'waitTime'),
    label: 'Average Waiting Time for Connection',
    min: 0,
    formatter: millis
  },
  {
    metric: getMetricMatch('connectionPools', 'connectionsCreated'),
    label: 'Connections Created',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('servlets', 'requests'),
    label: 'Requests',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('servlets', 'avgResponseTime'),
    label: 'Average Response Time',
    min: 0,
    formatter: muSecondsToMillis
  }
];
