/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { millis, muSecondsToMillis, number } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

const LABEL_SESSION = t('in-forge:plugins.webSphereLibertyAppContainer.labelSession');
const LABEL_POOL = t('in-forge:plugins.webSphereLibertyAppContainer.labelPool');

export default [
  {
    metrics: ['threadPool.activeThreads', 'threadPool.poolSize'],
    labels: [
      t('in-forge:plugins.webSphereLibertyAppContainer.labelActiveThreads'),
      t('in-forge:plugins.webSphereLibertyAppContainer.labelPoolSize')
    ],
    min: 0,
    category: [t('in-forge:plugins.webSphereLibertyAppContainer.titleThreadPool')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('sessions', 'live', LABEL_SESSION),
    label: t('in-forge:plugins.webSphereLibertyAppContainer.titleLiveSessions'),
    category: [t('in-forge:plugins.webSphereLibertyAppContainer.labelSessions')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('sessions', 'active', LABEL_SESSION),
    label: t('in-forge:plugins.webSphereLibertyAppContainer.titleActiveSessions'),
    category: [t('in-forge:plugins.webSphereLibertyAppContainer.labelSessions')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('sessions', 'created', LABEL_SESSION),
    label: t('in-forge:plugins.webSphereLibertyAppContainer.titleSessionsCreated'),
    category: [t('in-forge:plugins.webSphereLibertyAppContainer.labelSessions')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('sessions', 'invalidated', LABEL_SESSION),
    label: t('in-forge:plugins.webSphereLibertyAppContainer.titleSessionsInvalidated'),
    category: [t('in-forge:plugins.webSphereLibertyAppContainer.labelSessions')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('sessions', 'invalidatedByTimeout', LABEL_SESSION),
    label: t('in-forge:plugins.webSphereLibertyAppContainer.titleSessionsInvalidatedByTimeout'),
    category: [t('in-forge:plugins.webSphereLibertyAppContainer.labelSessions')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'managedConnectionCount', LABEL_POOL),
    label: t('in-forge:plugins.webSphereLibertyAppContainer.titleManagedConnectionObjectsInUse'),
    category: [t('in-forge:plugins.webSphereLibertyAppContainer.labelConnectionPools')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'freeConnectionCount', LABEL_POOL),
    label: t('in-forge:plugins.webSphereLibertyAppContainer.titleFreeConnectionsInPool'),
    category: [t('in-forge:plugins.webSphereLibertyAppContainer.labelConnectionPools')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'connectionHandleCount', LABEL_POOL),
    label: t('in-forge:plugins.webSphereLibertyAppContainer.titleConnectionObjectsInUse'),
    category: [t('in-forge:plugins.webSphereLibertyAppContainer.labelConnectionPools')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'waitTime', LABEL_POOL),
    label: t('in-forge:plugins.webSphereLibertyAppContainer.titleAvgWaitingTimeForConnection'),
    category: [t('in-forge:plugins.webSphereLibertyAppContainer.labelConnectionPools')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'connectionsCreated', LABEL_POOL),
    label: t('in-forge:plugins.webSphereLibertyAppContainer.titleConnectionsCreated'),
    category: [t('in-forge:plugins.webSphereLibertyAppContainer.labelConnectionPools')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'servlets',
      'requests',
      t('in-forge:plugins.webSphereLibertyAppContainer.labelServlet')
    ),
    label: 'Requests',
    category: [t('in-forge:plugins.webSphereLibertyAppContainer.labelServlets')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'servlets',
      'avgResponseTime',
      t('in-forge:plugins.webSphereLibertyAppContainer.labelServlet')
    ),
    label: 'Average Response Time',
    category: [t('in-forge:plugins.webSphereLibertyAppContainer.labelServlets')],
    min: 0,
    formatter: muSecondsToMillis
  }
];
