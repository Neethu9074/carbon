/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { millis } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Time/Second',
    metric: 'rts.gc.cpu_ms_delta',
    formatter: millis.compact
  },
  {
    label: 'GC CPU Time/Second',
    metric: 'rts.gc.gc_cpu_ms_delta',
    formatter: millis.compact
  }
];
