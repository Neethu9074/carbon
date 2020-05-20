import { bytes, percentage, number, kiloBytes, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'used_memory',
    label: 'Used memory',
    formatter: bytes
  },
  {
    metric: 'used_memory_rss',
    label: 'Used memory RSS',
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
    formatter: percentage
  },
  {
    metric: 'rejected_connections',
    label: 'Number of rejected connections',
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
    label: 'Cache hit rate',
    formatter: number.perSecond
  },
  {
    metric: 'keyspace_hits',
    label: 'Keyspace hits',
    formatter: number
  },
  {
    metric: 'keyspace_misses',
    label: 'Keyspace misses',
    formatter: number
  },
  {
    metric: 'evicted_keys',
    label: 'Evicted keys',
    formatter: number
  },
  {
    metric: 'expired_keys',
    label: 'Expired keys',
    formatter: number
  },
  {
    metric: 'master_connected_slaves',
    label: 'Number of connected slaves',
    formatter: number
  },
  {
    metric: 'latency_max',
    label: 'Latency',
    formatter: millis
  },
  {
    metric: 'throughput',
    label: 'Throughput',
    formatter: number.detailed
  },
  {
    metric: 'master_sync_left_bytes',
    label: 'KiloBytes left before syncing is complete',
    formatter: kiloBytes
  }
];
