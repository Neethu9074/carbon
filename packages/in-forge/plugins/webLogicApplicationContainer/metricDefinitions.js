import { millis, number } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: [
      'threadPool.idleThreads',
      'threadPool.totalThreads',
      'threadPool.hoggingThreads',
      'threadPool.standbyThreads',
      'threadPool.stuckThreads',

      'serverLogMessages.warnings',
      'serverLogMessages.errors',
      'serverLogMessages.alerts',
      'serverLogMessages.criticals',
      'serverLogMessages.emergencies',

      getMetricMatch('webApps', 'activeSessions'),
      getMetricMatch('webApps', 'createdSessions'),

      getMetricMatch('datasources', 'availableConnections'),
      getMetricMatch('datasources', 'currentActiveConnections'),
      getMetricMatch('datasources', 'connectionsInPool'),
      getMetricMatch('datasources', 'requestsWaitingForConnection'),
      getMetricMatch('datasources', 'connectionsCreated'),
      getMetricMatch('datasources', 'leakedConnections'),
      getMetricMatch('datasources', 'stateCode'),

      getMetricMatch('jmsDestinations', 'messagesPendingCount'),
      getMetricMatch('jmsDestinations', 'messagesCurrentCount'),
      getMetricMatch('jmsDestinations', 'messagesReceivedCount'),

      getMetricMatch('servlets', 'requests')
    ],
    labels: [
      'Idle Threads',
      'Total Threads',
      'Hogging Threads',
      'Stand by Threads',
      'Stuck Threads',
      'Warning',
      'Error',
      'Alert',
      'Critical',
      'Emergency',
      'Active Sessions',
      'Created Sessions',
      'Available Connections',
      'Current Active Connections',
      'Connections in Pool',
      'Requests Waiting for Connection',
      'Connections Created',
      'Leaked Connections',
      'State code',
      'Messages Pending Count',
      'Messages Current Count',
      'Messages Received Count',
      'Requests'
    ],
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
