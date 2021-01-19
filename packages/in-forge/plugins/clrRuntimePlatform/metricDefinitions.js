/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes, percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: ['mem.gen0GC', 'mem.gen1GC', 'mem.gen2GC'],
    labels: ['Generation 0', 'Generation 1', 'Generation 2'],
    min: 0,
    category: ['GC'],
    formatter: number
  },
  {
    metrics: ['threads.lck_cql', 'threads.lck_crs'],
    labels: ['Queue-Length', 'Contention-Rate'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['mem.gen1HeapBytes', 'mem.gen2HeapBytes', 'mem.loHeapBytes'],
    labels: ['Generation 1', 'Generation 2', 'Large Objects'],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'mem.time_in_gcn',
    label: 'GC time',
    formatter: percentage.compact
  }
];
