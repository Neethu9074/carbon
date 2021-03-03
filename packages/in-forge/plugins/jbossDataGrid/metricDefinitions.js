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
    metric: getDynamicMetricMatch('cachesStatistics', 'hitRatioV2', 'Cache'),
    label: t('in-forge:plugins.jbossDataGrid.hitRatio'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: hitRate
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'hits', 'Cache'),
    label: t('in-forge:plugins.jbossDataGrid.hits'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'misses', 'Cache'),
    label: t('in-forge:plugins.jbossDataGrid.misses'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'removeHits', 'Cache'),
    label: t('in-forge:plugins.jbossDataGrid.removeHits'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'removeMisses', 'Cache'),
    label: t('in-forge:plugins.jbossDataGrid.removeMisses'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'averageReadTime', 'Cache'),
    label: t('in-forge:plugins.jbossDataGrid.averageReadTime'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'averageWriteTime', 'Cache'),
    label: t('in-forge:plugins.jbossDataGrid.averageWriteTime'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'averageRemoveTime', 'Cache'),
    label: t('in-forge:plugins.jbossDataGrid.averageRemoveTime'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'throughput', 'Cache'),
    label: t('in-forge:plugins.jbossDataGrid.throughputOpsSec'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'stores', 'Cache'),
    label: t('in-forge:plugins.jbossDataGrid.cachePuts'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'readWriteRatioV2', 'Cache'),
    label: t('in-forge:plugins.jbossDataGrid.readWriteRatio'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: hitRate
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'numberOfEntries', 'Cache'),
    label: t('in-forge:plugins.jbossDataGrid.entries'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('cachesStatistics', 'evictions', 'Cache'),
    label: t('in-forge:plugins.jbossDataGrid.evictions'),
    category: [t('in-forge:plugins.jbossDataGrid.cacheStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'defaultThreadsSize', 'Cluster'),
    label: t('in-forge:plugins.jbossDataGrid.incomingMessagesThreadsSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'defaultActiveThreadsSize', 'Cluster'),
    label: t('in-forge:plugins.jbossDataGrid.incomingMessagesActiveThreadsSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'defaultQueueSize', 'Cluster'),
    label: t('in-forge:plugins.jbossDataGrid.incomingMessagesQueueSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'oobThreadsSize', 'Cluster'),
    label: t('in-forge:plugins.jbossDataGrid.oobMessagesThreadsSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'oobActiveThreadsSize', 'Cluster'),
    label: t('in-forge:plugins.jbossDataGrid.oobMessagesActiveThreadsSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'oobQueueSize', 'Cluster'),
    label: t('in-forge:plugins.jbossDataGrid.oobMessagesQueueSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'timerThreadsSize', 'Cluster'),
    label: t('in-forge:plugins.jbossDataGrid.timerThreadsSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'timerQueueSize', 'Cluster'),
    label: t('in-forge:plugins.jbossDataGrid.timerQueueSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('clustersUDPStatistics', 'timerTasks', 'Cluster'),
    label: t('in-forge:plugins.jbossDataGrid.timerTasksSize'),
    min: 0,
    category: [t('in-forge:plugins.jbossDataGrid.threadPools')],
    formatter: number
  }
];
