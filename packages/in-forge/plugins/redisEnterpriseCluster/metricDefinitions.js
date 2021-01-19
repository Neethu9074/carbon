/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number } from 'in-services/formatters/number';

export default [
  {
    metric: 'key_hits',
    label: 'Key Hits',
    formatter: number.compact
  },
  {
    metric: 'key_misses',
    label: 'Key Misses',
    formatter: number.compact
  },
  {
    metric: 'expired_objects',
    label: 'Expired Objects',
    formatter: number.compact
  },
  {
    metric: 'evicted_objects',
    label: 'Evicted Objects',
    formatter: number.compact
  },
  {
    metric: 'used_memory',
    label: 'Used Memory',
    formatter: bytes.compact
  },
  {
    metric: 'used_memory_rss',
    label: 'Used Memory RSS',
    formatter: bytes.detailed
  },
  {
    metric: 'mem_size_lua',
    label: 'Lua Memory Heap Size',
    formatter: bytes.detailed
  },
  {
    metric: 'conns',
    label: 'Connections Connected',
    formatter: number.compact
  },
  {
    metric: 'total_connections_received',
    label: 'Total Connections Received',
    formatter: number
  }
];
