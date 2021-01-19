/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage, bytes, nanos } from 'in-services/formatters/number';

export default [
  {
    metrics: ['cpu.total_usage', 'cpu.system_usage', 'cpu.user_usage'],
    labels: ['Total time', 'Kernel time', 'User time'],
    min: 0,
    category: ['CPU'],
    formatter: percentage
  },
  {
    metrics: ['cpu.throttling_count'],
    labels: ['Throttling count'],
    category: ['CPU'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['cpu.throttling_time'],
    labels: ['Throttling time'],
    category: ['CPU'],
    min: 0,
    formatter: nanos
  },
  {
    metrics: [
      'memory.usage',
      'memory.max_usage',
      'memory.total_rss',
      'memory.total_cache',
      'memory.active_anon',
      'memory.active_file',
      'memory.inactive_anon',
      'memory.inactive_file'
    ],
    labels: [
      'Usage',
      'Max usage',
      'RSS',
      'Cache',
      'Active anonymous',
      'Active cache',
      'Inactive anonymous',
      'Inactive cache'
    ],
    min: 0,
    category: ['Memory'],
    formatter: bytes
  },
  {
    metrics: ['blkio.blk_read', 'blkio.blk_write'],
    labels: ['Read', 'Write'],
    category: ['Block IO'],
    min: 0,
    formatter: number
  }
];
