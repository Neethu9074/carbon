/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { health, millis, number, bytes } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: 'gc.gcPause',
    label: 'GC Pause',
    min: 0,
    category: ['GC Activity'],
    formatter: millis
  },
  {
    metrics: ['activeHandles', 'activeRequests'],
    labels: ['#Handles', '#Requests'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['gc.minorGcs', 'gc.majorGcs'],
    labels: ['#Minor GCs', '#Major GCs'],
    min: 0,
    category: ['GC'],
    formatter: number
  },
  {
    metrics: ['memory.rss', 'memory.heapUsed', 'gc.usedHeapSizeAfterGc'],
    labels: ['RSS', 'Heap Size', 'Heap Size After GC'],
    min: 0,
    category: ['Memory'],
    formatter: bytes
  },
  {
    metrics: ['libuv.max', 'libuv.sum', 'libuv.lag'],
    labels: ['Longest time spent in a single loop', 'Total time spent in loop', 'Event loop lag'],
    min: 0,
    category: ['Event Loop'],
    formatter: millis
  },
  {
    metric: 'libuv.num',
    label: 'Loops per second',
    min: 0,
    category: ['Event Loop'],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('heapSpaces', 'available', 'Heap Space'),
    label: 'Available',
    min: 0,
    category: ['Heap Spaces'],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('heapSpaces', 'current', 'Heap Space'),
    label: 'Current',
    min: 0,
    category: ['Heap Spaces'],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('heapSpaces', 'used', 'Heap Space'),
    label: 'Used',
    min: 0,
    category: ['Heap Spaces'],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('heapSpaces', 'physical', 'Heap Space'),
    label: 'Physical',
    min: 0,
    category: ['Heap Spaces'],
    formatter: bytes
  },
  {
    metric: 'healthcheckResult',
    label: 'Health check result',
    min: 0,
    max: 1.1,
    category: ['Health'],
    formatter: health
  }
];
