/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, percentage, number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'used_memory',
    label: t('in-forge:plugins.redis.usedMemory'),
    formatter: bytes
  },
  {
    metric: 'used_memory_rss',
    label: t('in-forge:plugins.redis.usedMemoryRss'),
    formatter: bytes
  },
  {
    metric: 'used_memory_lua',
    label: t('in-forge:plugins.redis.usedMemoryLua'),
    formatter: bytes
  },
  {
    metric: 'mem_fragmentation_ratio',
    label: t('in-forge:plugins.redis.memoryFragmentationRatio'),
    formatter: percentage.compact
  },
  {
    metric: 'rejected_connections',
    label: t('in-forge:plugins.redis.numberOfRejectedConnections'),
    formatter: number
  },
  {
    metric: 'connected_clients',
    label: t('in-forge:plugins.redis.numberOfConnections'),
    formatter: number
  },
  {
    metric: 'blocked_clients',
    label: t('in-forge:plugins.redis.numberOfBlockedConnections'),
    formatter: number
  },
  {
    metric: 'hit_rate',
    label: t('in-forge:plugins.redis.cacheHitRate'),
    formatter: number.perSecond
  },
  {
    metric: 'keyspace_hits',
    label: t('in-forge:plugins.redis.keyspaceHits'),
    formatter: number
  },
  {
    metric: 'keyspace_misses',
    label: t('in-forge:plugins.redis.keyspaceMisses'),
    formatter: number
  },
  {
    metric: 'evicted_keys',
    label: t('in-forge:plugins.redis.redisEvictedKeys'),
    formatter: number
  },
  {
    metric: 'expired_keys',
    label: t('in-forge:plugins.redis.redisExpiredKeys'),
    formatter: number
  },
  {
    metric: 'master_connected_slaves',
    label: t('in-forge:plugins.redis.numberOfConnectedSlaves'),
    formatter: number
  },
  {
    metric: 'latency_max',
    label: t('in-forge:plugins.redis.latency'),
    formatter: millis.detailed
  },
  {
    metric: 'throughput',
    label: t('in-forge:plugins.redis.throughput'),
    formatter: number.detailed
  },
  {
    metric: 'master_sync_left_bytes',
    label: t('in-forge:plugins.redis.bytesLeftBeforeSyncingIsComplete'),
    formatter: bytes.detailed
  }
];
