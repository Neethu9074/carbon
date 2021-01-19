/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { hitRate, number } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'sess_conn',
      'client_req',
      'sess_dropped',
      'cache_hit',
      'cache_miss',
      'cache_hitpass',
      'n_expired',
      'n_lru_nuked'
    ],
    labels: [
      'Accepted client connections',
      'Received client requests',
      'Connections dropped due to a full queue',
      'Cache Hits',
      'Cache Misses',
      'Hits pass file',
      'Expired objects',
      'Nuked Objects'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['cache_hit_rate'],
    labels: ['Cache Hit Rate'],
    min: 0,
    formatter: hitRate
  },
  {
    metrics: ['threads', 'threads_created', 'threads_failed', 'threads_limited', 'thread_queue_len', 'sess_queued'],
    labels: ['Threads', 'Created', 'Failed', 'Limited', 'Queue', 'Queued requests'],
    min: 0,
    category: ['Threads'],
    formatter: number
  },
  {
    metrics: [
      'backend_conn',
      'backend_recycle',
      'backend_reuse',
      'backend_fail',
      'backend_unhealthy',
      'backend_busy',
      'backend_req'
    ],
    labels: ['Connections', 'Recycled', 'Reused', 'Idle closed', 'Unhealthy', 'Busy', 'Requests'],
    min: 0,
    category: ['Backend'],
    formatter: number
  }
];
