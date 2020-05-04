import { millis, number } from 'in-services/formatters/number';
import { getMetricMatchDefinition } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: [
      'threadPool.idleThreads',
      'threadPool.totalThreads',
      'threadPool.hoggingThreads',
      'threadPool.standbyThreads',
      'threadPool.stuckThreads'
    ],
    labels: ['Idle Threads', 'Total Threads', 'Hogging Threads', 'Stand by Threads', 'Stuck Threads'],
    category: ['Thread Pools'],
    min: 0,
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
    labels: ['Warning', 'Error', 'Alert', 'Critical', 'Emergency'],
    category: ['Server Log Messages'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getMetricMatchDefinition('webApps', 'activeSessions', 'Web App'),
      getMetricMatchDefinition('webApps', 'createdSessions', 'Web App')
    ],
    labels: ['Active Sessions', 'Created Sessions'],
    category: ['Web Apps'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getMetricMatchDefinition('datasources', 'availableConnections', 'Data Source'),
      getMetricMatchDefinition('datasources', 'currentActiveConnections', 'Data Source'),
      getMetricMatchDefinition('datasources', 'connectionsInPool', 'Data Source'),
      getMetricMatchDefinition('datasources', 'requestsWaitingForConnection', 'Data Source'),
      getMetricMatchDefinition('datasources', 'connectionsCreated', 'Data Source'),
      getMetricMatchDefinition('datasources', 'leakedConnections', 'Data Source'),
      getMetricMatchDefinition('datasources', 'stateCode', 'Data Source')
    ],
    labels: [
      'Available Connections',
      'Current Active Connections',
      'Connections in Pool',
      'Requests Waiting for Connection',
      'Connections Created',
      'Leaked Connections',
      'State code'
    ],
    category: ['Data Sources'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getMetricMatchDefinition('jmsDestinations', 'messagesPendingCount', 'JMS Destination'),
      getMetricMatchDefinition('jmsDestinations', 'messagesCurrentCount', 'JMS Destination'),
      getMetricMatchDefinition('jmsDestinations', 'messagesReceivedCount', 'JMS Destination')
    ],
    labels: ['Pending Messages', 'Current Messages ', 'Received Messages'],
    category: ['JMS'],
    min: 0,
    formatter: number
  },
  {
    metrics: [getMetricMatchDefinition('servlets', 'requests', 'Servlet')],
    labels: ['Requests'],
    category: ['Servlets'],
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatchDefinition('servlets', 'avgResponseTime', 'Servlet'),
    label: 'Average Response Time',
    category: ['Servlets'],
    min: 0,
    formatter: millis
  }
];
