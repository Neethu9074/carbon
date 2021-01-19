/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { millis, number } from 'in-services/formatters/number';

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
      getDynamicMetricMatch('webApps', 'activeSessions', 'Web App'),
      getDynamicMetricMatch('webApps', 'createdSessions', 'Web App')
    ],
    labels: ['Active Sessions', 'Created Sessions'],
    category: ['Web Apps'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('datasources', 'availableConnections', 'Data Source'),
      getDynamicMetricMatch('datasources', 'currentActiveConnections', 'Data Source'),
      getDynamicMetricMatch('datasources', 'connectionsInPool', 'Data Source'),
      getDynamicMetricMatch('datasources', 'requestsWaitingForConnection', 'Data Source'),
      getDynamicMetricMatch('datasources', 'connectionsCreated', 'Data Source'),
      getDynamicMetricMatch('datasources', 'leakedConnections', 'Data Source'),
      getDynamicMetricMatch('datasources', 'stateCode', 'Data Source')
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
      getDynamicMetricMatch('jmsDestinations', 'messagesPendingCount', 'JMS Destination'),
      getDynamicMetricMatch('jmsDestinations', 'messagesCurrentCount', 'JMS Destination'),
      getDynamicMetricMatch('jmsDestinations', 'messagesReceivedCount', 'JMS Destination')
    ],
    labels: ['Pending Messages', 'Current Messages ', 'Received Messages'],
    category: ['JMS'],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('servlets', 'requests', 'Servlet')],
    labels: ['Requests'],
    category: ['Servlets'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('servlets', 'avgResponseTime', 'Servlet'),
    label: 'Average Response Time',
    category: ['Servlets'],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      getDynamicMetricMatch('safAgents', 'messagesCurrentCount', 'SAF Agent'),
      getDynamicMetricMatch('safAgents', 'messagesPendingCount', 'SAF Agent'),
      getDynamicMetricMatch('safAgents', 'remoteEndpointsCurrentCount', 'SAF Agent')
    ],
    labels: ['Current Messages ', 'Pending Messages', 'Remote Endpoints Current'],
    category: ['SAF Agent'],
    min: 0,
    formatter: number
  }
];
