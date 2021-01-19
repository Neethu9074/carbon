/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number } from 'in-services/formatters/number';

export default [
  {
    metric: 'used_memory',
    label: 'Used memory',
    formatter: bytes
  },
  {
    metric: 'used_memory_rss',
    label: 'Used memory rss',
    formatter: bytes
  },
  {
    metric: 'used_memory_lua',
    label: 'Used memory lua',
    formatter: bytes
  },
  {
    metric: 'rejected_connections',
    label: 'Number of Rejected connections',
    formatter: number
  },
  {
    metric: 'connected_clients',
    label: 'Number of connections',
    formatter: number
  },
  {
    metric: 'blocked_clients',
    label: 'Number of blocked connections',
    formatter: number
  },
  {
    metric: 'hit_rate',
    label: 'Cache Hit rate',
    formatter: number.perSecond
  },
  {
    metric: 'keyspace_hits',
    label: 'Keyspace Hits',
    formatter: number
  },
  {
    metric: 'keyspace_misses',
    label: 'Keyspace Misses',
    formatter: number
  },
  {
    metric: 'evicted_keys',
    label: 'Redis Evicted keys',
    formatter: number
  },
  {
    metric: 'expired_keys',
    label: 'Redis Expired keys',
    formatter: number
  },
  {
    metric: 'throughput',
    label: 'Throughput',
    formatter: number.detailed
  },
  {
    metric: 'cluster_stats_messages_sent',
    label: 'Cluster messages sent',
    formatter: number.compact
  },
  {
    metric: 'cluster_stats_messages_received',
    label: 'Cluster messages received',
    formatter: number.compact
  },
  {
    metric: 'cluster_size',
    label: 'Cluster size',
    formatter: number.compact
  }
];
