/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { millis, number, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('sessions', 'activeSessions', 'Deployment'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.activeSessions'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.webDeployments')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('servlets', 'avgResponseTime', 'Servlet'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.averageResponseTime'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.servlets')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('servlets', 'requests', 'Servlet'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.requests'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.servlets')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectors', 'avgResponseTime', 'Connector'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.averageResponseTime'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.connectors')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('connectors', 'requests', 'Connector'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.requests'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.connectors')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectors', 'errors', 'Connector'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.errors'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.connectors')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'active', 'Datasource JNDI'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.activeConnections'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.datasourceConnectionPools')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'available', 'Datasource JNDI'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.availableConnections'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.datasourceConnectionPools')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'inUse', 'Datasource JNDI'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.connectionsInUse'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.datasourceConnectionPools')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'created', 'Datasource JNDI'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.connectionsCreated'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.datasourceConnectionPools')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('connectionPools', 'usedRatio', 'Datasource JNDI'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.connectionsUsedPercentage'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.datasourceConnectionPools')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'currentThreadCount', 'Pool'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.currentThreadCount'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.threadPools')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'currentThreadsBusy', 'Pool'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.currentBusyThreads'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.threadPools')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'minSpareThreads', 'Pool'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.minSpareThreads'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.threadPools')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'maxSpareThreads', 'Pool'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.maxSpareThreads'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.threadPools')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('threadPools', 'usedRatio', 'Pool'),
    label: t('in-forge:plugins.jBossAsApplicationContainer.threadsUsedPercentage'),
    category: [t('in-forge:plugins.jBossAsApplicationContainer.threadPools')],
    min: 0,
    formatter: percentage
  }
];
