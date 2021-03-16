/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'used_memory',
    label: t('in-forge:plugins.redisCluster.usedMemory'),
    formatter: bytes
  },
  {
    metric: 'used_memory_rss',
    label: t('in-forge:plugins.redisCluster.usedMemoryRss'),
    formatter: bytes
  },
  {
    metric: 'used_memory_lua',
    label: t('in-forge:plugins.redisCluster.usedMemoryLua'),
    formatter: bytes
  },
  {
    metric: 'rejected_connections',
    label: t('in-forge:plugins.redisCluster.numberOfRejectedConnections'),
    formatter: number
  },
  {
    metric: 'connected_clients',
    label: t('in-forge:plugins.redisCluster.numberOfConnections'),
    formatter: number
  },
  {
    metric: 'blocked_clients',
    label: t('in-forge:plugins.redisCluster.numberOfBlockedConnections'),
    formatter: number
  },
  {
    metric: 'hit_rate',
    label: t('in-forge:plugins.redisCluster.cacheHitRate'),
    formatter: number.perSecond
  },
  {
    metric: 'keyspace_hits',
    label: t('in-forge:plugins.redisCluster.keyspaceHits'),
    formatter: number
  },
  {
    metric: 'keyspace_misses',
    label: t('in-forge:plugins.redisCluster.keyspaceMisses'),
    formatter: number
  },
  {
    metric: 'evicted_keys',
    label: t('in-forge:plugins.redisCluster.redisEvictedKeys'),
    formatter: number
  },
  {
    metric: 'expired_keys',
    label: t('in-forge:plugins.redisCluster.redisExpiredKeys'),
    formatter: number
  },
  {
    metric: 'throughput',
    label: t('in-forge:plugins.redisCluster.throughput'),
    formatter: number.detailed
  },
  {
    metric: 'cluster_stats_messages_sent',
    label: t('in-forge:plugins.redisCluster.clusterMessagesSent'),
    formatter: number.compact
  },
  {
    metric: 'cluster_stats_messages_received',
    label: t('in-forge:plugins.redisCluster.clusterMessagesReceived'),
    formatter: number.compact
  },
  {
    metric: 'cluster_size',
    label: t('in-forge:plugins.redisCluster.clusterSize'),
    formatter: number.compact
  }
];
