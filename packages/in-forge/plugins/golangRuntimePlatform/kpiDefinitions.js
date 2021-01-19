/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesTwoDecimalPlaces, timeNs } from 'in-services/formatters/number';

export default [
  {
    label: 'GC Pause',
    metric: 'metrics.memory.pause_ns',
    formatter: timeNs
  },
  {
    label: 'Used Heap',
    metric: 'metrics.memory.heap_in_use',
    formatter: bytesTwoDecimalPlaces
  }
];
