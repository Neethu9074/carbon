import { bytes, percentageZeroDecimalPlaces, number } from 'in-services/formatters/number';

export default [
  {
    metric: 'used_memory',
    label: 'Used memory',
    formatter: bytes
  },
  {
    metric: 'mem_fragmentation_ratio',
    label: 'Memory fragmentation ratio',
    formatter: percentageZeroDecimalPlaces
  },
  {
    metric: 'rejected_connections',
    label: 'Number of Rejected connections',
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
  }
];
