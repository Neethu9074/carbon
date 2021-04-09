/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { millis, number, hitRate } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['hotRod.numberOfLocalConnections', 'hotRod.numberOfGlobalConnections'],
    labels: [
      t('in-forge:plugins.jbossDataGrid.numberOfLocalConnections'),
      t('in-forge:plugins.jbossDataGrid.numberOfGlobalConnections')
    ],
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.connections')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'hitRatioV2', t('in-forge:plugins.jbossDataGrid.cache')),
    label: t('in-forge:plugins.jbossDataGrid.hitRatio'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: hitRate
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'hits', t('in-forge:plugins.jbossDataGrid.cache')),
    label: t('in-forge:plugins.jbossDataGrid.hits'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'misses', t('in-forge:plugins.jbossDataGrid.cache')),
    label: t('in-forge:plugins.jbossDataGrid.misses'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'removeHits', t('in-forge:plugins.jbossDataGrid.cache')),
    label: t('in-forge:plugins.jbossDataGrid.removeHits'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'removeMisses', t('in-forge:plugins.jbossDataGrid.cache')),
    label: t('in-forge:plugins.jbossDataGrid.removeMisses'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'averageReadTime', t('in-forge:plugins.jbossDataGrid.cache')),
    label: t('in-forge:plugins.jbossDataGrid.averageReadTime'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'averageWriteTime', t('in-forge:plugins.jbossDataGrid.cache')),
    label: t('in-forge:plugins.jbossDataGrid.averageWriteTime'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'averageRemoveTime', t('in-forge:plugins.jbossDataGrid.cache')),
    label: t('in-forge:plugins.jbossDataGrid.averageRemoveTime'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'throughput', t('in-forge:plugins.jbossDataGrid.cache')),
    label: t('in-forge:plugins.jbossDataGrid.throughputOpsSec'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'stores', t('in-forge:plugins.jbossDataGrid.cache')),
    label: t('in-forge:plugins.jbossDataGrid.cachePuts'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'readWriteRatioV2', t('in-forge:plugins.jbossDataGrid.cache')),
    label: t('in-forge:plugins.jbossDataGrid.readWriteRatio'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: hitRate
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'numberOfEntries', t('in-forge:plugins.jbossDataGrid.cache')),
    label: t('in-forge:plugins.jbossDataGrid.entries'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'evictions', t('in-forge:plugins.jbossDataGrid.cache')),
    label: t('in-forge:plugins.jbossDataGrid.evictions'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'clustersUDPStatistics',
      'defaultThreadsSize',
      t('in-forge:plugins.jbossDataGrid.cluster')
    ),
    label: t('in-forge:plugins.jbossDataGrid.incomingMessagesThreadsSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'clustersUDPStatistics',
      'defaultActiveThreadsSize',
      t('in-forge:plugins.jbossDataGrid.cluster')
    ),
    label: t('in-forge:plugins.jbossDataGrid.incomingMessagesActiveThreadsSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'clustersUDPStatistics',
      'defaultQueueSize',
      t('in-forge:plugins.jbossDataGrid.cluster')
    ),
    label: t('in-forge:plugins.jbossDataGrid.incomingMessagesQueueSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'clustersUDPStatistics',
      'oobThreadsSize',
      t('in-forge:plugins.jbossDataGrid.cluster')
    ),
    label: t('in-forge:plugins.jbossDataGrid.oobMessagesThreadsSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'clustersUDPStatistics',
      'oobActiveThreadsSize',
      t('in-forge:plugins.jbossDataGrid.cluster')
    ),
    label: t('in-forge:plugins.jbossDataGrid.oobMessagesActiveThreadsSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'oobQueueSize', t('in-forge:plugins.jbossDataGrid.cluster')),
    label: t('in-forge:plugins.jbossDataGrid.oobMessagesQueueSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'clustersUDPStatistics',
      'timerThreadsSize',
      t('in-forge:plugins.jbossDataGrid.cluster')
    ),
    label: t('in-forge:plugins.jbossDataGrid.timerThreadsSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'clustersUDPStatistics',
      'timerQueueSize',
      t('in-forge:plugins.jbossDataGrid.cluster')
    ),
    label: t('in-forge:plugins.jbossDataGrid.timerQueueSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'timerTasks', t('in-forge:plugins.jbossDataGrid.cluster')),
    label: t('in-forge:plugins.jbossDataGrid.timerTasksSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  }
];
