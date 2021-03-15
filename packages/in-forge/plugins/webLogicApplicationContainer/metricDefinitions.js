/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { millis, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const LABEL_DATASOURCE = t('in-forge:plugins.webLogicAppContainer.labelDataSource');
const LABEL_JMSDESTINATION = t('in-forge:plugins.webLogicAppContainer.labelJMSDestination');
const LABEL_SAFAGENT = t('in-forge:plugins.webLogicAppContainer.labelSAFAgent');

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
      t('in-forge:plugins.webLogicAppContainer.labelIdleThreads'),
      t('in-forge:plugins.webLogicAppContainer.labelTotalThreads'),
      t('in-forge:plugins.webLogicAppContainer.labelHoggingThreads'),
      t('in-forge:plugins.webLogicAppContainer.labelStandByThreads'),
      t('in-forge:plugins.webLogicAppContainer.labelStuckThreads')
    ],
    category: [t('in-forge:plugins.webLogicAppContainer.categoryThreadPools')],
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
    labels: [
      t('in-forge:plugins.webLogicAppContainer.labelWarning'),
      t('in-forge:plugins.webLogicAppContainer.labelError'),
      t('in-forge:plugins.webLogicAppContainer.labelAlert'),
      t('in-forge:plugins.webLogicAppContainer.labelCritical'),
      t('in-forge:plugins.webLogicAppContainer.labelEmergency')
    ],
    category: [t('in-forge:plugins.webLogicAppContainer.labelErrorLogMessages')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('webApps', 'activeSessions', t('in-forge:plugins.webLogicAppContainer.labelWebApp')),
      getDynamicMetricMatch('webApps', 'createdSessions', t('in-forge:plugins.webLogicAppContainer.labelWebApp'))
    ],
    labels: [
      t('in-forge:plugins.webLogicAppContainer.titleActiveSessions'),
      t('in-forge:plugins.webLogicAppContainer.labelCreatedSessions')
    ],
    category: [t('in-forge:plugins.webLogicAppContainer.categoryWebApps')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('datasources', 'availableConnections', LABEL_DATASOURCE),
      getDynamicMetricMatch('datasources', 'currentActiveConnections', LABEL_DATASOURCE),
      getDynamicMetricMatch('datasources', 'connectionsInPool', LABEL_DATASOURCE),
      getDynamicMetricMatch('datasources', 'requestsWaitingForConnection', LABEL_DATASOURCE),
      getDynamicMetricMatch('datasources', 'connectionsCreated', LABEL_DATASOURCE),
      getDynamicMetricMatch('datasources', 'leakedConnections', LABEL_DATASOURCE),
      getDynamicMetricMatch('datasources', 'stateCode', LABEL_DATASOURCE)
    ],
    labels: [
      t('in-forge:plugins.webLogicAppContainer.labelAvailableConnections'),
      t('in-forge:plugins.webLogicAppContainer.labelCurrentActiveConnections'),
      t('in-forge:plugins.webLogicAppContainer.labelConnectionsInPool'),
      t('in-forge:plugins.webLogicAppContainer.labelRequestsWaitingForConnection'),
      t('in-forge:plugins.webLogicAppContainer.labelConnectionsCreated'),
      t('in-forge:plugins.webLogicAppContainer.labelLeakedConnections'),
      t('in-forge:plugins.webLogicAppContainer.labelStateCode')
    ],
    category: [t('in-forge:plugins.webLogicAppContainer.categoryDataSources')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('jmsDestinations', 'messagesPendingCount', LABEL_JMSDESTINATION),
      getDynamicMetricMatch('jmsDestinations', 'messagesCurrentCount', LABEL_JMSDESTINATION),
      getDynamicMetricMatch('jmsDestinations', 'messagesReceivedCount', LABEL_JMSDESTINATION)
    ],
    labels: [
      t('in-forge:plugins.webLogicAppContainer.titlePendingMessages'),
      t('in-forge:plugins.webLogicAppContainer.labelCurrentMessages'),
      t('in-forge:plugins.webLogicAppContainer.titleReceivedMessages')
    ],
    category: [t('in-forge:plugins.webLogicAppContainer.categoryJMS')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('servlets', 'requests', t('in-forge:plugins.webLogicAppContainer.titleServlet'))],
    labels: [t('in-forge:plugins.webLogicAppContainer.titleRequests')],
    category: [t('in-forge:plugins.webLogicAppContainer.titleServlets')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'servlets',
      'avgResponseTime',
      t('in-forge:plugins.webLogicAppContainer.titleServlet')
    ),
    label: t('in-forge:plugins.webLogicAppContainer.titleAverageResponseTime'),
    category: [t('in-forge:plugins.webLogicAppContainer.titleServlets')],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      getDynamicMetricMatch('safAgents', 'messagesCurrentCount', LABEL_SAFAGENT),
      getDynamicMetricMatch('safAgents', 'messagesPendingCount', LABEL_SAFAGENT),
      getDynamicMetricMatch('safAgents', 'remoteEndpointsCurrentCount', LABEL_SAFAGENT)
    ],
    labels: [
      t('in-forge:plugins.webLogicAppContainer.labelCurrentMessages'),
      t('in-forge:plugins.webLogicAppContainer.titlePendingMessages'),
      t('in-forge:plugins.webLogicAppContainer.labelRemoteEndpointsCurrent')
    ],
    category: [LABEL_SAFAGENT],
    min: 0,
    formatter: number
  }
];
