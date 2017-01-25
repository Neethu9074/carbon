import {
  millis,
  number
} from 'in-services/formatters/number';
import {getMetricMatch} from 'in-sdk/metrics/metricDefinitions';


export default [
  {
    metrics: [
      'threadPool.idleThreads',
      'threadPool.totalThreads',
      'threadPool.hoggingThreads',
      'threadPool.standbyThreads',
      'threadPool.stuckThreads'
    ],
    labels: [
      'Idle Threads',
      'Total Threads',
      'Hogging Threads',
      'Stand by Threads',
      'Stuck Threads'
    ],
    min: 0,
    category: ['Thread Pool'],
    formatter: number
  },
  {
    metrics: [
      'serverLogMessages.warnings',
      'serverLogMessages.errors',
      'serverLogMessages.alerts',
      'serverLogMessages.criticals',
      'serverLogMessages.emergencies'
    ],
    labels: [
      'Warning',
      'Error',
      'Alert',
      'Critical',
      'Emergencie'
    ],
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('webApps', 'activeSessions'),
    label: 'Active Sessions',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('webApps', 'createdSessions'),
    label: 'Created Sessions',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('datasources', 'availableConnections'),
    label: 'Available Connections',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('datasources', 'connectionsInPool'),
    label: 'Connections in Pool',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('datasources', 'requestsWaitingForConnection'),
    label: 'Requests Waiting for Connection',
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('datasources', 'connectionsCreated'),
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
    formatter: millis
  }
];
