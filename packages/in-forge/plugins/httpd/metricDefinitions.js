/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { percentage, number, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['requests', 'kBytes'],
    labels: ['Requests', 'kBytes'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['conns_total', 'conns_async_writing', 'conns_async_keep_alive', 'conns_async_closing'],
    labels: ['Connections', 'Async Connections Writing', 'Async Connections Keep-alive', 'Async Connections Closing'],
    min: 0,
    category: ['Connections'],
    formatter: number
  },
  {
    metrics: [
      'worker.waiting',
      'worker.starting',
      'worker.reading',
      'worker.writing',
      'worker.keepalive',
      'worker.dns',
      'worker.closing',
      'worker.logging',
      'worker.graceful',
      'worker.idle'
    ],
    labels: ['Waiting', 'Starting', 'Reading', 'Writing', 'Keepalive', 'Dns', 'Closing', 'Logging', 'Graceful', 'Idle'],
    min: 0,
    category: ['Worker'],
    formatter: number
  },
  {
    metrics: ['cpu_load'],
    labels: ['CPU load'],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['bytes_per_req'],
    labels: ['Traffic per request'],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'busy_workers',
    label: 'Busy workers',
    formatter: number
  }
];
