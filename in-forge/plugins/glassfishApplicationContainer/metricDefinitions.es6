import { hitRate, number, millis } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'http_request_count',
      'http_error',
      'keep_alive_connections',
      'keep_alive_flushes',
      'keep_alive_hits',
      'keep_alive_refusals',
      'keep_alive_timeouts',
      'file_cache_hits',
      'file_cache_misses',
      'file_cache_info_hits',
      'file_cache_info_misses',
      'jdbc_connection_used',
      'jdbc_connection_free'
    ],
    labels: [
      'Requests',
      'Errors',
      'Connections',
      'Flushes',
      'Hits',
      'Refusals',
      'Timeouts',
      'Hits',
      'Misses',
      'Info Hits',
      'Info Misses',
      'Used',
      'Free'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['threads_core', 'threads_executed_tasks', 'threads_current_count', 'threads_current_busy'],
    labels: ['Core threads', 'Executed threads', 'Current threads', 'Busy threads'],
    min: 0,
    category: ['Threads'],
    formatter: number
  },
  {
    metrics: [
      'connections_open',
      'connections_overflows',
      'connections_queued',
      'connections_peak_queued',
      'connections_ticks_total_queued',
      'connections_total'
    ],
    labels: ['Open', 'Overflows', 'Queued', 'Peak Queued', 'Ticks Total Queued', 'Total'],
    min: 0,
    category: ['Connections'],
    formatter: number
  },
  {
    metrics: ['http_max_time', 'http_proc_time'],
    labels: ['Max Time', 'Processing Time'],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['file_cache_rate', 'file_cache_info_rate'],
    labels: ['Hit rate', 'Info hit rate'],
    min: 0,
    max: 1,
    formatter: hitRate
  }
];
