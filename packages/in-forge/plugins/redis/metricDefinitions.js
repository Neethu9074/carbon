/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, percentage, number, millis } from 'in-services/formatters/number';

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
    metric: 'mem_fragmentation_ratio',
    label: 'Memory fragmentation ratio',
    formatter: percentage.compact
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
    metric: 'master_connected_slaves',
    label: 'Number of Connected slaves',
    formatter: number
  },
  {
    metric: 'latency_max',
    label: 'Latency',
    formatter: millis.detailed
  },
  {
    metric: 'throughput',
    label: 'Throughput',
    formatter: number.detailed
  },
  {
    metric: 'master_sync_left_bytes',
    label: 'Bytes left before syncing is complete',
    formatter: bytes.detailed
  }
];
