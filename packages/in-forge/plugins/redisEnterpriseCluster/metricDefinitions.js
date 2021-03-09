/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'key_hits',
    label: t('in-forge:plugins.redisEnterpriseCluster.keyHits'),
    formatter: number.compact
  },
  {
    metric: 'key_misses',
    label: t('in-forge:plugins.redisEnterpriseCluster.keyMisses'),
    formatter: number.compact
  },
  {
    metric: 'expired_objects',
    label: t('in-forge:plugins.redisEnterpriseCluster.expiredObjects'),
    formatter: number.compact
  },
  {
    metric: 'evicted_objects',
    label: t('in-forge:plugins.redisEnterpriseCluster.evictedObjects'),
    formatter: number.compact
  },
  {
    metric: 'used_memory',
    label: t('in-forge:plugins.redisEnterpriseCluster.usedMemory'),
    formatter: bytes.compact
  },
  {
    metric: 'used_memory_rss',
    label: t('in-forge:plugins.redisEnterpriseCluster.usedMemoryRss'),
    formatter: bytes.detailed
  },
  {
    metric: 'mem_size_lua',
    label: t('in-forge:plugins.redisEnterpriseCluster.luaMemoryHeapSize'),
    formatter: bytes.detailed
  },
  {
    metric: 'conns',
    label: t('in-forge:plugins.redisEnterpriseCluster.connectionsConnected'),
    formatter: number.compact
  },
  {
    metric: 'total_connections_received',
    label: t('in-forge:plugins.redisEnterpriseCluster.totalConnectionsReceived'),
    formatter: number
  }
];
