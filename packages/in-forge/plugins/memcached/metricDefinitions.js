/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { hitRate, number, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['cmd_get', 'cmd_set'],
    labels: ['Gets', 'Sets'],
    min: 0,
    category: ['Commands'],
    formatter: number
  },
  {
    metrics: ['bytes_read', 'bytes_write'],
    labels: ['Reads (bytes)', 'Writes (bytes)'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['get_hits', 'get_misses', 'delete_hits', 'delete_misses', 'cmd_flush', 'evictions', 'bytes'],
    labels: ['Get Hits', 'Get Misses', 'Delete Hits', 'Delete Misses', 'Flush', 'Evictions', 'Used Bytes'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['get_hit_rate', 'delete_hit_rate'],
    labels: ['Get Hit Ratio', 'Delete Hit Ratio'],
    min: 0,
    formatter: hitRate
  },
  {
    metrics: ['conn_connected', 'conn_queued', 'conn_yields'],
    labels: ['Connected', 'Queued', 'Yields'],
    min: 0,
    category: ['Connections'],
    formatter: number
  }
];
