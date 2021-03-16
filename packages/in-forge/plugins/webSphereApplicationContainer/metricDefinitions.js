/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { millis, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['threadPools.webContainer.activeThreads', 'threadPools.webContainer.poolSize'],
    labels: [
      t('in-forge:plugins.webSphereAppContainer.labelActiveThreads'),
      t('in-forge:plugins.webSphereAppContainer.labelPoolSize')
    ],
    min: 0,
    category: [t('in-forge:plugins.webSphereAppContainer.categoryThreadPool')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'sessionManagers',
      'activeCount',
      t('in-forge:plugins.webSphereAppContainer.labelWebModule')
    ),
    label: t('in-forge:plugins.webSphereApplicationContainer.sessions'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelWebModule')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'servlets',
      'avgResponseTime',
      t('in-forge:plugins.webSphereAppContainer.labelServlet')
    ),
    label: t('in-forge:plugins.webSphereAppContainer.labelAverageResponseTime'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelServlets')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('servlets', 'requests', t('in-forge:plugins.webSphereAppContainer.labelServlets')),
    label: t('in-forge:plugins.webSphereAppContainer.labelRequestCount'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelServlets')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('servlets', 'errors', t('in-forge:plugins.webSphereAppContainer.labelServlet')),
    label: t('in-forge:plugins.webSphereAppContainer.labelErrors'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelServlets')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'datasources',
      'poolSize',
      t('in-forge:plugins.webSphereAppContainer.labelDatasource')
    ),
    label: t('in-forge:plugins.webSphereAppContainer.labelPoolSize'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelDatasources')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'datasources',
      'freePoolSize',
      t('in-forge:plugins.webSphereAppContainer.labelDatasource')
    ),
    label: t('in-forge:plugins.webSphereAppContainer.titleFreeConnectionsInPool'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelDatasources')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch(
      'datasources',
      'waitingThreadCount',
      t('in-forge:plugins.webSphereAppContainer.labelDatasource')
    ),
    label: t('in-forge:plugins.webSphereAppContainer.titleThreadsWaitingForConnection'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelDatasources')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'datasources',
      'averageWaitTime',
      t('in-forge:plugins.webSphereAppContainer.labelDatasource')
    ),
    label: t('in-forge:plugins.webSphereAppContainer.titleAverageWaitingTime'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelDatasources')],
    min: 0,
    formatter: millis
  }
];
