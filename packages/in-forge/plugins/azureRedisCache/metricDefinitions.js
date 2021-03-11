/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, percentage, bytesZeroDecimalPlaces, percentagePlain } from 'in-services/formatters/number';

export default [
  {
    metric: 'connectedclients',
    label: t('in-forge:plugins.azureRedisCache.labelConnectedClients'),
    category: [t('in-forge:plugins.azureRedisCache.performance')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'totalcommandsprocessed',
    label: t('in-forge:plugins.azureRedisCache.labelTotalOperations'),
    category: [t('in-forge:plugins.azureRedisCache.performance')],
    min: 0,
    formatter: number
  },
  {
    metric: 'cachehits',
    label: t('in-forge:plugins.azureRedisCache.labelCacheHits'),
    category: [t('in-forge:plugins.azureRedisCache.performance')],
    min: 0,
    formatter: number
  },
  {
    metric: 'cachemisses',
    label: t('in-forge:plugins.azureRedisCache.labelCacheMisses'),
    category: [t('in-forge:plugins.azureRedisCache.performance')],
    min: 0,
    formatter: number
  },
  {
    metric: 'getcommands',
    label: t('in-forge:plugins.azureRedisCache.labelGets'),
    category: [t('in-forge:plugins.azureRedisCache.performance')],
    min: 0,
    formatter: number
  },
  {
    metric: 'setcommands',
    label: t('in-forge:plugins.azureRedisCache.labelSets'),
    category: [t('in-forge:plugins.azureRedisCache.performance')],
    min: 0,
    formatter: number
  },
  {
    metric: 'operationsPerSecond',
    label: t('in-forge:plugins.azureRedisCache.labelOperationsPerSecond'),
    category: [t('in-forge:plugins.azureRedisCache.performance')],
    min: 0,
    formatter: number
  },
  {
    metric: 'evictedkeys',
    label: t('in-forge:plugins.azureRedisCache.labelEvictedKeys'),
    category: [t('in-forge:plugins.azureRedisCache.performance')],
    min: 0,
    formatter: number
  },
  {
    metric: 'totalkeys',
    label: t('in-forge:plugins.azureRedisCache.labelTotalKeys'),
    category: [t('in-forge:plugins.azureRedisCache.performance')],
    min: 0,
    formatter: number
  },
  {
    metric: 'expiredkeys',
    label: t('in-forge:plugins.azureRedisCache.labelExpiredKeys'),
    category: [t('in-forge:plugins.azureRedisCache.performance')],
    min: 0,
    formatter: number
  },
  {
    metric: 'usedmemory',
    label: t('in-forge:plugins.azureRedisCache.labelUsedMemory'),
    category: [t('in-forge:plugins.azureRedisCache.performance')],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  },
  {
    metric: 'usedmemorypercentage',
    label: t('in-forge:plugins.azureRedisCache.labelPercentageOfMemoryUsed'),
    min: 0,
    formatter: percentagePlain
  },
  {
    metric: 'usedmemoryRss',
    label: t('in-forge:plugins.azureRedisCache.labelUsedMemoryRSS'),
    category: [t('in-forge:plugins.azureRedisCache.performance')],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  },
  {
    metric: 'serverLoad',
    label: t('in-forge:plugins.azureRedisCache.labelServerLoad'),
    category: [t('in-forge:plugins.azureRedisCache.performance')],
    min: 0,
    formatter: percentage
  },
  {
    metric: 'cacheWrite',
    label: t('in-forge:plugins.azureRedisCache.labelCacheWrite'),
    category: [t('in-forge:plugins.azureRedisCache.traffic')],
    min: 0,
    formatter: number
  },
  {
    metric: 'cacheRead',
    label: t('in-forge:plugins.azureRedisCache.labelCacheRead'),
    category: [t('in-forge:plugins.azureRedisCache.traffic')],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  },
  {
    metric: 'percentProcessorTime',
    label: t('in-forge:plugins.azureRedisCache.labelCPU'),
    category: [t('in-forge:plugins.azureRedisCache.performance')],
    min: 0,
    formatter: percentage
  }
];
