/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { millis, number, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch(
      'sessions',
      'activeSessions',
      t('in-forge:plugins.jBossAsApplicationContainer.deployment')
    ),
    label: t('in-forge:plugins.jBossAsApplicationContainer.activeSessions'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.webDeployments')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'servlets',
      'avgResponseTime',
      t('in-forge:plugins.jBossAsApplicationContainer.servlet')
    ),
    label: t('in-forge:plugins.jBossAsApplicationContainer.averageResponseTime'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.servlets')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('servlets', 'requests', t('in-forge:plugins.jBossAsApplicationContainer.servlet')),
    label: t('in-forge:plugins.jBossAsApplicationContainer.requests'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.servlets')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'connectors',
      'avgResponseTime',
      t('in-forge:plugins.jBossAsApplicationContainer.connector')
    ),
    label: t('in-forge:plugins.jBossAsApplicationContainer.averageResponseTime'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.connectors')],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      getDynamicMetricMatch('connectors', 'requests', t('in-forge:plugins.jBossAsApplicationContainer.connector')),
      getDynamicMetricMatch('connectors', 'errors', t('in-forge:plugins.jBossAsApplicationContainer.connector'))
    ],
    labels: [
      t('in-forge:plugins.jBossAsApplicationContainer.requests'),
      t('in-forge:plugins.jBossAsApplicationContainer.errors')
    ],
    category: [t('in-forge:plugins.jBossAsApplicationContainer.connectors')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'datasources.metrics',
        'active',
        t('in-forge:plugins.jBossAsApplicationContainer.datasourceJndi')
      ),
      getDynamicMetricMatch(
        'datasources.metrics',
        'available',
        t('in-forge:plugins.jBossAsApplicationContainer.datasourceJndi')
      ),
      getDynamicMetricMatch(
        'datasources.metrics',
        'inUse',
        t('in-forge:plugins.jBossAsApplicationContainer.datasourceJndi')
      ),
      getDynamicMetricMatch(
        'datasources.metrics',
        'created',
        t('in-forge:plugins.jBossAsApplicationContainer.datasourceJndi')
      ),
      getDynamicMetricMatch(
        'datasources.metrics',
        'timedOut',
        t('in-forge:plugins.jBossAsApplicationContainer.datasourceJndi')
      )
    ],
    labels: [
      t('in-forge:plugins.jBossAsApplicationContainer.activeConnections'),
      t('in-forge:plugins.jBossAsApplicationContainer.availableConnections'),
      t('in-forge:plugins.jBossAsApplicationContainer.connectionsInUse'),
      t('in-forge:plugins.jBossAsApplicationContainer.connectionsCreated'),
      t('in-forge:plugins.jBossAsApplicationContainer.timedOut')
    ],
    category: [t('in-forge:plugins.jBossAsApplicationContainer.datasources')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'datasources.metrics',
        'blockingTime',
        t('in-forge:plugins.jBossAsApplicationContainer.datasourceJndi')
      ),
      getDynamicMetricMatch(
        'datasources.metrics',
        'creationTime',
        t('in-forge:plugins.jBossAsApplicationContainer.datasourceJndi')
      )
    ],
    labels: [
      t('in-forge:plugins.jBossAsApplicationContainer.timeWaitedForExclusiveLockOnPool'),
      t('in-forge:plugins.jBossAsApplicationContainer.timeSpentOnCreatingConnections')
    ],
    category: [t('in-forge:plugins.jBossAsApplicationContainer.datasources')],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      getDynamicMetricMatch('connectionPools', 'active', t('in-forge:plugins.jBossAsApplicationContainer.poolName')),
      getDynamicMetricMatch('connectionPools', 'available', t('in-forge:plugins.jBossAsApplicationContainer.poolName')),
      getDynamicMetricMatch('connectionPools', 'inUse', t('in-forge:plugins.jBossAsApplicationContainer.poolName')),
      getDynamicMetricMatch('connectionPools', 'created', t('in-forge:plugins.jBossAsApplicationContainer.poolName'))
    ],
    labels: [
      t('in-forge:plugins.jBossAsApplicationContainer.activeConnections'),
      t('in-forge:plugins.jBossAsApplicationContainer.availableConnections'),
      t('in-forge:plugins.jBossAsApplicationContainer.connectionsInUse'),
      t('in-forge:plugins.jBossAsApplicationContainer.connectionsCreated')
    ],
    category: [t('in-forge:plugins.jBossAsApplicationContainer.connectionPools')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'connectionPools',
      'usedRatio',
      t('in-forge:plugins.jBossAsApplicationContainer.poolName')
    ),
    label: t('in-forge:plugins.jBossAsApplicationContainer.connectionsUsedPercentage'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.connectionPools')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'threadPools',
        'currentThreadCount',
        t('in-forge:plugins.jBossAsApplicationContainer.pool')
      ),
      getDynamicMetricMatch(
        'threadPools',
        'currentThreadsBusy',
        t('in-forge:plugins.jBossAsApplicationContainer.pool')
      ),
      getDynamicMetricMatch('threadPools', 'minSpareThreads', t('in-forge:plugins.jBossAsApplicationContainer.pool')),
      getDynamicMetricMatch('threadPools', 'maxSpareThreads', t('in-forge:plugins.jBossAsApplicationContainer.pool'))
    ],
    labels: [
      t('in-forge:plugins.jBossAsApplicationContainer.currentThreadCount'),
      t('in-forge:plugins.jBossAsApplicationContainer.currentBusyThreads'),
      t('in-forge:plugins.jBossAsApplicationContainer.minSpareThreads'),
      t('in-forge:plugins.jBossAsApplicationContainer.maxSpareThreads')
    ],
    category: [t('in-forge:plugins.jBossAsApplicationContainer.threadPools')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'usedRatio', t('in-forge:plugins.jBossAsApplicationContainer.pool')),
    label: t('in-forge:plugins.jBossAsApplicationContainer.threadsUsedPercentage'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.threadPools')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'workerMetrics.workerThreadMetrics',
        'busyWorkerThreadCount',
        t('in-forge:plugins.jBossAsApplicationContainer.workerName')
      ),
      getDynamicMetricMatch(
        'workerMetrics.workerThreadMetrics',
        'workerQueueSize',
        t('in-forge:plugins.jBossAsApplicationContainer.workerName')
      )
    ],
    labels: [
      t('in-forge:plugins.jBossAsApplicationContainer.busyWorkerThreadCount'),
      t('in-forge:plugins.jBossAsApplicationContainer.workerQueueSize')
    ],
    category: [t('in-forge:plugins.jBossAsApplicationContainer.workersCategory')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'workerMetrics.connCountMetrics',
        'connCount',
        t('in-forge:plugins.jBossAsApplicationContainer.server')
      )
    ],
    labels: [t('in-forge:plugins.jBossAsApplicationContainer.connCount')],
    category: [t('in-forge:plugins.jBossAsApplicationContainer.workersCategory')],
    min: 0,
    formatter: number
  }
];
