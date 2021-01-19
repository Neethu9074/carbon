/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number, nanos } from 'in-services/formatters/number';

export default [
  {
    metrics: ['metrics.memory.pause_ns'],
    labels: ['GC Pause'],
    min: 0,
    category: ['GC'],
    formatter: nanos
  },
  {
    metrics: ['metrics.goroutine', 'metrics.memory.heap_objects'],
    labels: ['Executed Goroutines', 'Objects'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['metrics.memory.heap_sys', 'metrics.memory.heap_in_use', 'metrics.memory.alloc', 'metrics.memory.sys'],
    labels: ['System Heap', 'Used Heap', 'Allocated Memory', 'Obtained From System'],
    min: 0,
    category: ['Metrics'],
    formatter: bytes
  }
];
